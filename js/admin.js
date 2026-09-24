import { getClient, errorMessage } from './wedding-api.js';
import { summarize } from './wedding-forms.js';
import { filterAttendance } from './attendance-filter.js';
const $ = id => document.getElementById(id);
let client, version = 0, busy = false, currentRows = [], selectedSide = 'all';
function clearPrivateData() { ++version; currentRows = []; selectedSide = 'all'; $('admin-content').hidden = true; $('admin-stats').replaceChildren(); $('admin-rows').replaceChildren(); }
function showRows(rows) {
  currentRows = rows;
  const labels = ['총 응답 수','참석 예정 인원','불참 응답 수','신랑측 참석 인원','신부측 참석 인원','식사 예정 인원'];
  $('admin-stats').replaceChildren(); $('admin-rows').replaceChildren();
  summarize(rows).forEach((value,i) => {
    const side = i === 3 ? 'groom' : i === 4 ? 'bride' : null;
    const card = document.createElement(side ? 'button' : 'div'), number = document.createElement('strong');
    card.className='w-stat'; card.textContent=labels[i]; number.textContent=String(value); card.append(number);
    if (side) {
      card.type='button'; card.dataset.side=side; card.setAttribute('aria-controls','admin-rows');
      const hint=document.createElement('span');hint.className='w-stat-hint';hint.textContent='명단 보기 ›';card.append(hint);
      card.onclick=()=>{selectedSide=side;renderList();$('admin-list-title').focus({preventScroll:true});$('admin-list-title').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
    }
    $('admin-stats').append(card);
  });
  renderList();
}
function renderList() {
  const rows=filterAttendance(currentRows,selectedSide), root=$('admin-rows');root.replaceChildren();
  document.querySelectorAll('#admin-stats [data-side]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.side===selectedSide)));
  const tools=document.createElement('div'),title=document.createElement('h2');tools.className='w-list-tools';title.id='admin-list-title';title.tabIndex=-1;
  const label=selectedSide==='groom'?'신랑측 참석 명단':selectedSide==='bride'?'신부측 참석 명단':'전체 응답';
  const people=rows.reduce((sum,row)=>sum+row.guest_count,0);
  title.textContent=selectedSide==='all'?`${label} · ${rows.length}건`:`${label} · ${rows.length}건 / ${people}명`;
  tools.append(title);
  if(selectedSide!=='all'){const reset=document.createElement('button');reset.type='button';reset.className='w-button w-secondary';reset.textContent='전체 응답 보기';reset.onclick=()=>{selectedSide='all';renderList();$('admin-list-title').focus();};tools.append(reset);}
  root.append(tools);
  if(!rows.length){const empty=document.createElement('p');empty.className='w-status';empty.textContent=selectedSide==='all'?'아직 접수된 응답이 없어요.':'아직 참석 예정인 하객이 없어요.';root.append(empty);}
  if(selectedSide!=='all'&&rows.length){const note=document.createElement('p');note.className='w-help';note.textContent='이름은 응답자 기준이며, 인원에는 동행인이 포함됩니다.';root.append(note);}
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
