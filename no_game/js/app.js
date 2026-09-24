import { CONFIG } from './config.js';
import { StoryGame } from './game.js';
import { buildInvitation } from './invitation.js';
export const game = new StoryGame(showInvitation);
function showInvitation(){game.pause();document.getElementById('game').hidden=true;document.getElementById('invitation').hidden=false;document.getElementById('skip').textContent='이야기 다시 보기 ↻';window.scrollTo(0,0);document.getElementById('invitation-title').focus({preventScroll:true});}
function restart(){game.reset();document.getElementById('skip').textContent='청첩장 바로 보기 ↗';window.scrollTo(0,0);document.getElementById('action').focus({preventScroll:true});}
buildInvitation(restart,game.gallery);
// Optional features load independently of the story and completed invitation.
import('./wedding-social.js').catch(error => console.error('Wedding forms could not load', error));
const invitationSound=document.createElement('button');invitationSound.id='invite-sound';invitationSound.className='outline';invitationSound.textContent=game.sound?'♪ 음악 켜짐':'♪ 음악 꺼짐';invitationSound.setAttribute('aria-pressed',String(game.sound));invitationSound.addEventListener('click',game.toggleSound);document.getElementById('replay').after(invitationSound);
document.getElementById('skip').addEventListener('click',()=>game.hidden?restart():showInvitation());
document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();restart();});
document.title=`${CONFIG.text.title} · ${CONFIG.groom} ♥ ${CONFIG.bride}`;
document.querySelector('.page-footer span').textContent=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',year:'numeric',month:'long',day:'numeric'}).format(new Date(CONFIG.date)).toUpperCase();
