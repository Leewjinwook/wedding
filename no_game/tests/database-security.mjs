import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const db=new PGlite({extensions:{pgcrypto}});
await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
grant usage on schema public,auth to anon,authenticated;grant execute on function auth.uid() to public;`);
const schema=fs.readFileSync(new URL('../supabase/schema.sql', import.meta.url),'utf8');
await db.exec(schema);await db.exec(schema);
const admin='11111111-1111-4111-8111-111111111111', stranger='22222222-2222-4222-8222-222222222222';
await db.query('insert into auth.users values ($1),($2)',[admin,stranger]);
await db.query('insert into wedding_private.admins values ($1)',[admin]);
async function as(role,sql,params=[],uid=''){
 await db.exec('begin');
 try{await db.query("select set_config('request.jwt.claim.sub',$1,true)",[uid]);await db.exec(`set local role ${role}`);const result=await db.query(sql,params);await db.exec('commit');return result;}
 catch(error){await db.exec('rollback');throw error;}
}
let checks=0;async function denied(role,sql,params=[],uid=''){await assert.rejects(()=>as(role,sql,params,uid));checks++;}
await as('anon',"insert into attendance(name,side,attendance_status,guest_count,meal_status) values ('테스트','groom','attending',2,'yes')");checks++;
await denied('anon','select * from attendance');
assert.equal((await as('authenticated','select * from attendance',[],stranger)).rows.length,0);checks++;
assert.equal((await as('authenticated','select * from attendance',[],admin)).rows.length,1);checks++;
await denied('authenticated',"insert into wedding_private.admins values ($1)",[stranger],stranger);
await denied('anon',"insert into attendance(name,side,attendance_status,guest_count,meal_status) values ('x','groom','attending',21,'yes')");
await denied('anon',"insert into attendance(name,side,attendance_status,guest_count,meal_status) values ('x','groom','not_attending',1,'yes')");
await denied('anon',"insert into attendance(name,side,attendance_status,guest_count,meal_status,created_at) values ('x','groom','attending',1,'yes',now())");
const request='33333333-3333-4333-8333-333333333333';
const params=['<img src=x onerror=alert(1)>','축하합니다 <script>alert(1)</script>','password123',request];
const id=(await as('anon','select create_guestbook($1,$2,$3,$4) as id',params)).rows[0].id;
assert.equal((await as('anon','select create_guestbook($1,$2,$3,$4) as id',params)).rows[0].id,id);checks++;
await denied('anon','select password_hash from guestbook');await denied('authenticated','select * from guestbook',[],stranger);
await denied('anon','delete from guestbook where id=$1',[id]);
const visible=(await as('anon','select * from list_guestbook(100,0)')).rows;
assert.equal(visible.length,1);assert.deepEqual(Object.keys(visible[0]),['id','name','message','created_at']);checks++;
const hash=(await db.query('select password_hash from guestbook')).rows[0].password_hash;assert.notEqual(hash,'password123');assert.match(hash,/^\$2/);checks++;
for(let i=0;i<5;i++)assert.equal((await as('anon','select delete_guestbook($1,$2) as status',[id,'wrongpass'])).rows[0].status,'wrong_password');checks++;
assert.equal((await as('anon','select delete_guestbook($1,$2) as status',[id,'password123'])).rows[0].status,'locked');checks++;
await db.query("update guestbook set locked_until=now()-interval '1 second' where id=$1",[id]);
assert.equal((await as('anon','select delete_guestbook($1,$2) as status',[id,'password123'])).rows[0].status,'deleted');checks++;
assert.equal((await as('anon','select * from list_guestbook()')).rows.length,0);checks++;
await denied('anon','select create_guestbook($1,$2,$3,$4)',['하객','a'.repeat(301),'password',request]);
await denied('anon','select create_guestbook($1,$2,$3,$4)',['하객','축하','한'.repeat(25),request]);
await db.close();console.log(`${checks} database security/validation checks passed, including schema rerun.`);
