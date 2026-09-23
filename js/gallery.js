import { CONFIG as C } from './config.js';
export class PhotoGallery {
 constructor(){
  this.dialog=document.createElement('dialog');this.dialog.id='photo-gallery';this.dialog.setAttribute('aria-labelledby','gallery-title');
  this.dialog.innerHTML='<div class="modal-top"><div><span class="kicker">A LITTLE TREASURE</span><h2 id="gallery-title"></h2></div><button id="close-gallery" aria-label="사진 닫고 이야기 계속">닫기 ×</button></div><div class="photo-stage"><img id="gallery-image" alt=""><p id="photo-error" hidden>사진을 불러오지 못했어요. 다음 사진을 확인해 주세요.</p></div><p id="photo-caption"></p><div class="gallery-nav"><button id="photo-prev" aria-label="이전 사진">←</button><span id="photo-count" role="status"></span><button id="photo-next" aria-label="다음 사진">→</button></div><button id="gallery-continue" class="primary">사진을 간직하고 계속 걷기 →</button><p id="gallery-auto-note" class="fine-print"></p>';
  document.body.append(this.dialog);this.index=0;this.photos=[];this.timer=null;this.onClose=null;
  this.image=this.dialog.querySelector('#gallery-image');this.skip=document.createElement('button');this.skip.className='text-button';this.skip.id='gallery-skip';this.skip.textContent='청첩장 바로 보기 ↗';this.dialog.append(this.skip);
  this.dialog.querySelector('#close-gallery').onclick=()=>this.dialog.close();this.dialog.querySelector('#gallery-continue').onclick=()=>this.dialog.close();
  this.dialog.querySelector('#photo-prev').onclick=()=>{this.stopAuto();this.go(-1);};this.dialog.querySelector('#photo-next').onclick=()=>{this.stopAuto();this.go(1);};
  this.dialog.addEventListener('close',()=>{this.stopAuto();this.renderId++;document.body.classList.remove('modal-open');this.onClose?.();this.onClose=null;});
  this.dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();e.stopPropagation();this.stopAuto();this.go(e.key==='ArrowRight'?1:-1);}});
  let touchStart=null;
  const stage=this.dialog.querySelector('.photo-stage');
  stage.addEventListener('touchstart',e=>{touchStart=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
  stage.addEventListener('touchcancel',()=>{touchStart=null;},{passive:true});
  stage.addEventListener('touchend',e=>{if(!touchStart)return;const start=touchStart;touchStart=null;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5){this.stopAuto();this.go(dx<0?1:-1);}},{passive:true});
  this.cache=new Map();this.renderId=0;

 }
 open({ids,title,auto=false,onClose=()=>{},onSkip=null}){this.photos=ids.map(id=>C.photos.find(p=>p.id===id)).filter(Boolean);if(!this.photos.length){onClose();return;}this.stopAuto();this.index=0;this.onClose=onClose;this.skip.hidden=!onSkip;this.skip.onclick=()=>{this.dialog.close();requestAnimationFrame(()=>onSkip?.());};this.dialog.querySelector('#gallery-title').textContent=title;this.dialog.querySelector('#gallery-continue').textContent=title==='우리의 사진첩'?'사진첩 닫기':'사진을 간직하고 계속 걷기 →';this.image.hidden=true;this.dialog.querySelector('#photo-caption').textContent='';this.dialog.querySelector('#photo-count').textContent='…';this.render();document.body.classList.add('modal-open');this.dialog.showModal();this.dialog.querySelector('#close-gallery').focus();if(auto){this.dialog.querySelector('#gallery-auto-note').textContent='자동 감상 중 · 화살표를 누르면 사진에 머물러요';this.timer=setInterval(()=>{if(document.hidden)return;if(this.index<this.photos.length-1)this.go(1);else this.dialog.close();},2600);}else this.dialog.querySelector('#gallery-auto-note').textContent='좌우로 넘겨 보세요 · 사진은 전체 비율로 표시됩니다.';}
 stopAuto(){clearInterval(this.timer);this.timer=null;this.dialog.querySelector('#gallery-auto-note').textContent='좌우로 넘겨 보세요 · 닫으면 이야기가 이어집니다.';}
 go(step){this.index=(this.index+step+this.photos.length)%this.photos.length;this.render();}
 loadPhoto(src){
  if(!this.cache.has(src)){
   const pending=new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{const decoded=img.decode?img.decode():Promise.resolve();decoded.catch(()=>{}).then(()=>resolve(img));};img.onerror=reject;img.src=src;});
   this.cache.set(src,pending);pending.catch(()=>this.cache.delete(src));
  }
  return this.cache.get(src);
 }
 async render(){
  const id=++this.renderId,p=this.photos[this.index],index=this.index;
  const stage=this.dialog.querySelector('.photo-stage'),error=this.dialog.querySelector('#photo-error');
  stage.setAttribute('aria-busy','true');error.hidden=true;
  // Keep the previous decoded photo visible until the requested photo is ready.
  try{
   await this.loadPhoto(p.src);if(id!==this.renderId)return;
   this.image.src=p.src;this.image.alt=p.alt;this.image.hidden=false;
   this.dialog.querySelector('#photo-caption').textContent=p.alt;
   this.dialog.querySelector('#photo-count').textContent=`${String(index+1).padStart(2,'0')} / ${String(this.photos.length).padStart(2,'0')}`;
  }catch{if(id!==this.renderId)return;this.image.hidden=true;error.hidden=false;}
  finally{if(id===this.renderId)stage.setAttribute('aria-busy','false');}
  for(const step of [-1,1]){const next=this.photos[(index+step+this.photos.length)%this.photos.length];this.loadPhoto(next.src).catch(()=>{});}
 }
}
