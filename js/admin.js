import { getClient, errorMessage } from './wedding-api.js';
import { summarize } from './wedding-forms.js';
const $ = id => document.getElementById(id);
let client, version = 0, busy = false;
function clearPrivateData() { ++version; $('admin-content').hidden = true; $('admin-stats').replaceChildren(); $('admin-rows').replaceChildren(); }
function showRows(rows) {
  const labels = ['총 응답 수','참석 예정 인원','불참 응답 수','신랑측 참석 인원','신부측 참석 인원','식사 예정 인원'];
  $('admin-stats').replaceChildren(); $('admin-rows').replaceChildren();
  summarize(rows).forEach((value,i) => { const card = document.createElement('div'), number = document.createElement('strong'); card.className='w-stat'; card.textContent=labels[i]; number.textContent=String(value); card.append(number); $('admin-stats').append(card); });
  for (const row of rows) {
    const card=document.createElement('article'), heading=document.createElement('h2'), dl=document.createElement('dl'); card.className='w-entry'; heading.textContent=row.name;
    const values = [['구분',row.side==='groom'?'신랑측':'신부측'],['참석',row.attendance_status==='attending'?'참석':'불참'],['인원',`${row.guest_count}명`],['식사',({yes:'식사',no:'안 함',undecided:'미정',not_applicable:'해당 없음'})[row.meal_status]],['메시지',row.message||'—'],['작성일',new Date(row.created_at).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})]];
    for(const [label,value] of values){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;dl.append(dt,dd);}
    card.append(heading,dl);$('admin-rows').append(card);
  }
}
async function load() {
  const current = ++version;
  $('admin-status').textContent='참석 응답을 확인하는 중…'; $('admin-refresh').disabled=true;
  try {
    const admin=await client.rpc('is_wedding_admin'); if(admin.error) throw admin.error;
    if(!admin.data) { await client.auth.signOut(); clearPrivateData(); $('admin-login').hidden=false; $('admin-status').textContent='관리자로 등록된 계정만 조회할 수 있어요.'; return; }
    // Read every page so stats do not silently stop at Supabase's default row limit.
    const rows=[]; let cursor;
    while(true){
      let query=client.from('attendance').select('id,name,side,attendance_status,guest_count,meal_status,message,created_at').order('created_at',{ascending:false}).order('id',{ascending:false}).limit(500);
      if(cursor)query=query.or(`created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`);
      const result=await query;
      if(result.error)throw result.error;if(current!==version)return;
      rows.push(...result.data);if(result.data.length<500)break;cursor=result.data.at(-1);
    }
    if(current!==version)return;
    showRows(rows); $('admin-content').hidden=false; $('admin-login').hidden=true;
    $('admin-status').textContent=rows.length?'최신 응답을 불러왔어요.':'아직 접수된 참석 응답이 없어요.';
  } catch(error) { if(current===version){ clearPrivateData(); $('admin-login').hidden=false; $('admin-status').textContent=errorMessage(error); } }
  finally { $('admin-refresh').disabled=false; }
}
$('admin-login').addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;busy=true;const form=event.currentTarget,button=form.querySelector('button');button.disabled=true;$('admin-status').textContent='로그인하는 중…';
  try{
    client=await getClient();const result=await client.auth.signInWithPassword({email:form.elements.email.value.trim(),password:form.elements.password.value});
    if(result.error){$('admin-status').textContent='이메일과 비밀번호를 확인해 주세요. 로그인할 수 없어요.';return;}
    form.elements.password.value='';await load();
  }catch(error){$('admin-status').textContent=errorMessage(error);}
  finally{busy=false;button.disabled=false;}
});
$('admin-refresh').onclick=load;
$('admin-logout').onclick=async()=>{clearPrivateData();$('admin-login').hidden=false;$('admin-status').textContent='로그아웃했어요.';if(client)await client.auth.signOut();};
// Credentials stay in memory only; a reload requires login again.
window.addEventListener('pagehide',clearPrivateData);
