import { CONFIG as C } from './config.js';

// Building position verified from OpenStreetMap way/181525932.
// The map loads only when the invitation's location section comes into view.
export function mountVenueMap(container){
 if(!container||!C.map)return;
 const {latitude:lat,longitude:lon,kakaoJavaScriptKey:key}=C.map;
 const showOpenMap=()=>{
  const query=new URLSearchParams({bbox:[lon-.003,lat-.0018,lon+.003,lat+.0018].join(','),layer:'mapnik',marker:`${lat},${lon}`});
  const iframe=document.createElement('iframe');iframe.src=`https://www.openstreetmap.org/export/embed.html?${query}`;
  iframe.title='신도림 테크노마트 위치 지도';iframe.loading='eager';iframe.referrerPolicy='strict-origin-when-cross-origin';
  container.replaceChildren(iframe);container.dataset.provider='openstreetmap';
  let note=container.nextElementSibling;if(note?.classList.contains('map-status'))note.remove();
  if(key){note=document.createElement('p');note.className='map-status';note.textContent='카카오 지도 연결이 지연되고 있어요. 아래 지도 버튼도 이용하실 수 있어요.';container.after(note);}
 };
 const showKakao=()=>{
  let done=false;
  const fallback=()=>{if(!done){done=true;showOpenMap();}};
  const timeout=setTimeout(fallback,6000);
  const script=document.createElement('script');script.src=`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&autoload=false`;
  script.onerror=fallback;
  script.onload=()=>{if(done)return;try{window.kakao.maps.load(()=>{if(done)return;try{
   const center=new window.kakao.maps.LatLng(lat,lon);
   const map=new window.kakao.maps.Map(container,{center,level:3});
   new window.kakao.maps.Marker({map,position:center,title:C.venue});
   map.addControl(new window.kakao.maps.ZoomControl(),window.kakao.maps.ControlPosition.RIGHT);
   const resize=new ResizeObserver(()=>{map.relayout();map.setCenter(center);});resize.observe(container);
   done=true;clearTimeout(timeout);container.dataset.provider='kakao';
  }catch{fallback();}});}catch{fallback();}};
  document.head.append(script);
 };
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();key?showKakao():showOpenMap();}},{rootMargin:'150px'});
 observer.observe(container);
}
