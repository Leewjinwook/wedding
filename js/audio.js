import { CONFIG } from './config.js';
// User-supplied local MP3; the original synthesized background score is removed.
export class WeddingAudio {
 constructor(){
  this.enabled=false;this.onStateChange=()=>{};this.pendingPlay=null;
  this.media=document.createElement('audio');this.media.id='wedding-bgm';
  this.media.src=new URL(CONFIG.music.src,document.baseURI).href;
  this.media.loop=true;this.media.preload='auto';this.media.volume=CONFIG.music.volume;
  this.media.setAttribute('playsinline','');this.media.hidden=true;document.body.append(this.media);
  for(const event of ['playing','pause','waiting','ended','error'])this.media.addEventListener(event,()=>this.onStateChange());
  document.addEventListener('visibilitychange',()=>{if(document.hidden)this.suspend();else if(this.enabled)this.start();});
 }
 get isPlaying(){return !this.media.paused&&!this.media.ended&&this.media.readyState>=2;}
 async setEnabled(enabled){this.enabled=enabled;if(enabled)return this.start();this.suspend();return true;}
 async start(){
  if(!this.enabled||document.hidden||this.isPlaying)return true;
  if(this.pendingPlay)return this.pendingPlay;
  this.pendingPlay=this.media.play().then(()=>{if(!this.enabled||document.hidden)this.media.pause();this.onStateChange();return true;}).catch(error=>{
   // Autoplay denial keeps the preference on, allowing the next tap to start it.
   this.onStateChange();return error.name==='NotAllowedError'||error.name==='AbortError';
  }).finally(()=>{this.pendingPlay=null;});
  return this.pendingPlay;
 }
 suspend(){this.media.pause();this.onStateChange();}
 chime(){ /* Let the supplied song play without layering the old synthesized notes. */ }
}
