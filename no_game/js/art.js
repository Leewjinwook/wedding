// 직접 제작한 정수 좌표 픽셀 드로잉. 외부 이미지/폰트/게임 엔진 의존 없음.
const P={ink:'#594737',grass:'#dae4b7',light:'#e7edcb',dark:'#a7ba87',leaf:'#8fa977',leaf2:'#b8c991',leaf3:'#d2dcaa',bark:'#9a7b57',path:'#efe0bf',edge:'#ddc99f',rose:'#c7787b',pink:'#edb6ac',cream:'#fff7e6',hair:'#433a33',skin:'#f4cdb0',white:'#fff9ec'};
export class PixelWorld{
 constructor(canvas){this.canvas=canvas;this.c=canvas.getContext('2d');this.c.imageSmoothingEnabled=false;}
 rect(x,y,w,h,color){this.c.fillStyle=color;this.c.fillRect(Math.round(x),Math.round(y),w,h);}
 oval(x,y,rx,ry,color){for(let yy=-ry;yy<=ry;yy+=2){let w=Math.floor(rx*Math.sqrt(Math.max(0,1-yy*yy/(ry*ry)))/2)*2;this.rect(x-w,y+yy,w*2,2,color);}}
 heart(x,y,s=1,color=P.rose){['0110110','1111111','1111111','0111110','0011100','0001000'].forEach((r,yy)=>[...r].forEach((p,xx)=>{if(p==='1')this.rect(x+xx*s,y+yy*s,s,s,color)}));}
 flower(x,y,col=P.pink){this.rect(x,y,1,5,P.leaf);this.rect(x-2,y+2,2,1,P.leaf);this.rect(x-2,y-2,5,3,col);this.rect(x-1,y-3,3,5,col);this.rect(x,y-1,1,1,P.cream);}
 tree(x,y,pink=false){this.oval(x,y+4,16,5,'#bccb98');this.rect(x-3,y-16,6,20,P.bark);this.rect(x+1,y-16,2,17,'#b5956b');this.oval(x,y-24,20,22,pink?'#dba5a0':P.leaf);this.oval(x-3,y-29,17,17,pink?'#edc2b7':P.leaf2);this.oval(x-5,y-33,10,10,pink?'#f4d5c5':P.leaf3);for(let i=0;i<6;i++)this.rect(x-13+(i*7)%26,y-34+(i*11)%25,3,2,pink?'#e4afa4':'#a3ba7f');}
 house(x,y,pink=false){this.rect(x-27,y-1,55,7,'#b8c697');this.rect(x-23,y-31,46,33,'#c5a17c');this.rect(x-21,y-30,42,29,'#f6e6c4');this.rect(x-28,y-35,56,5,'#98765b');for(let i=0;i<5;i++)this.rect(x-27+i*4,y-39-i*4,54-i*8,5,pink?'#c68680':'#a8ac83');for(let i=0;i<4;i++)this.rect(x-22+i*6,y-39-i*4,42-i*12,1,pink?'#e0a49a':'#c8c5a0');this.rect(x-5,y-18,11,20,'#a18565');this.rect(x-3,y-16,7,17,'#806d58');this.rect(x+2,y-8,1,2,'#f6d999');for(const dx of [-15,11]){this.rect(x+dx,y-23,9,11,'#a68b66');this.rect(x+dx+1,y-22,7,8,'#c5d6cd');this.rect(x+dx+4,y-22,1,8,'#fff1cf');this.rect(x+dx+1,y-18,7,1,'#fff1cf');}this.rect(x-25,y-29,50,5,pink?'#b8656a':'#8b9c79');for(let i=0;i<8;i++)this.rect(x-24+i*6,y-29,3,5,P.cream);this.rect(x-16,y-9,9,3,'#b28f65');this.flower(x-13,y-9);this.flower(x+17,y+1);}
 bench(x,y){this.rect(x-12,y-8,24,3,'#ab8862');this.rect(x-12,y-4,24,3,'#c8a275');this.rect(x-14,y,28,3,'#967457');this.rect(x-11,y+3,3,5,P.bark);this.rect(x+8,y+3,3,5,P.bark);}
 lamp(x,y){this.rect(x,y-23,2,25,'#9e8763');this.rect(x-3,y-26,8,7,'#b49c70');this.rect(x-2,y-25,6,5,'#fff3b7');this.rect(x-1,y-28,4,2,P.ink);this.rect(x-2,y,6,2,'#9e8763');}
 character(x,y,kind,t,walk=false,wedding=false,face=1,kneel=false,scale=1,outfit=0){
  // Rounded, two-head-tall sprites; all details share the map's one-pixel grid.
  const c=this.c;c.save();c.translate(Math.round(x),Math.round(y));c.scale(scale,scale);
  const step=walk?Math.floor(t/160)%4:0,bob=walk&&step%2?1:0;
  this.oval(0,1,10,2,'#b2bd97');c.translate(0,-bob+(kneel?3:0));
  const girl=kind==='bride',hair='#493a35',shine='#6b5146',skin='#ffe0bf',shade='#efbc9f';
  // Hair silhouette and veil sit behind the little body.
  if(girl){this.rect(-10,-29,20,22,hair);this.rect(-12,-24,24,14,hair);this.rect(-11,-10,5,4,hair);this.rect(7,-11,5,4,hair);if(wedding){this.rect(-13,-29,2,23,'#fff8ed');this.rect(11,-29,2,23,'#fff8ed');this.rect(-12,-8,24,3,'#e6dace');}}
  const leg=step===1?1:step===3?-1:0;
  this.rect(-5,-4,4,5+leg,'#5a4540');this.rect(2,-4,4,5-leg,'#5a4540');
  this.rect(-6,0+leg,5,2,girl?'#bd7c73':'#66504a');this.rect(2,0-leg,5,2,girl?'#bd7c73':'#66504a');
  if(outfit){
   const formal=outfit===3,denim=outfit===2;
   const coat=formal?'#806c63':denim?'#83a3b9':girl?'#b7b4ad':'#515d83';
   const edge=formal?'#66524b':denim?'#66869d':girl?'#94968f':'#3c4669';
   if(girl&&formal){
    this.rect(-6,-15,12,6,'#fffaf1');this.rect(-8,-9,16,5,'#f9eddb');this.rect(-10,-4,20,3,'#e4d2bd');this.rect(-8,-5,16,3,'#fff9ed');
    this.rect(-7,-14,14,2,'#fffdf6');this.rect(-5,-7,1,4,'#e4d2bd');this.rect(5,-7,1,4,'#e4d2bd');
   }else{
    // Original body proportions, with jacket panels and a contrasting shirt.
    this.rect(-7,-15,14,12,edge);this.rect(-6,-14,12,9,coat);this.rect(-3,-15,6,11,denim?(girl?'#494044':'#aaadb1'):'#fff3da');
    this.rect(-5,-14,2,5,denim?'#c7d8de':coat);this.rect(3,-14,2,5,denim?'#c7d8de':coat);
    if(denim){this.rect(-6,-8,3,2,'#b3c9d4');this.rect(4,-8,2,2,'#b3c9d4');}
    if(formal){this.rect(-1,-14,2,9,'#423b40');}
    if(girl){this.rect(-8,-5,16,3,edge);this.rect(-10,-3,20,2,edge);}
   }
   for(const side of [-1,1]){const arm=walk?(step%2?side:-side):0;this.rect(side<0?-9:7,-13+arm,3,6,girl&&formal?'#fff6e6':coat);this.rect(side<0?-9:7,-8+arm,3,3,shade);this.rect(side<0?-9:7,-8+arm,2,2,skin);}
  }else{
  if(girl){
   this.rect(-6,-15,12,6,wedding?'#fffaf1':'#de9e9d');this.rect(-8,-9,16,5,wedding?'#f9eddb':'#e8b1ac');this.rect(-10,-4,20,3,wedding?'#e4d2bd':'#b9787a');this.rect(-8,-5,16,3,wedding?'#fff9ed':'#f1c3b8');
   this.rect(-4,-14,8,2,'#fff4e4');this.rect(-1,-11,2,8,'#c96f75');this.rect(-5,-10,4,2,'#c96f75');this.rect(1,-10,4,2,'#c96f75');this.rect(-5,-7,1,4,wedding?'#fffef8':'#f8d3c6');this.rect(5,-7,1,4,wedding?'#fffef8':'#f8d3c6');
  }else{
   this.rect(-7,-15,14,12,wedding?'#443e3b':'#7c987d');this.rect(-6,-14,12,9,wedding?'#59504a':'#a3b898');this.rect(-3,-15,6,8,'#fff3da');
   if(wedding){this.rect(-3,-13,2,2,'#b85b66');this.rect(1,-13,2,2,'#b85b66');this.rect(0,-9,1,1,'#66504a');this.rect(0,-6,1,1,'#66504a');}else{this.rect(-5,-7,10,2,'#d7daba');this.rect(-4,-3,8,1,'#657f68');}
  }
  // Soft sleeves, tiny palms, and the alternating walk cycle.
  for(const side of [-1,1]){const arm=walk?(step%2?side:-side):0;this.rect(side<0?-9:7,-13+arm,3,6,girl?(wedding?'#fff6e6':'#e6aaa5'):(wedding?'#59504a':'#8ba582'));this.rect(side<0?-9:7,-8+arm,3,3,shade);this.rect(side<0?-9:7,-8+arm,2,2,skin);}
  }
  // Stepped round cheeks rather than a narrow rectangular face.
  this.rect(-7,-33,14,2,hair);this.rect(-10,-31,20,15,hair);this.rect(-11,-27,22,8,hair);
  this.rect(-8,-29,16,13,shade);this.rect(-10,-25,20,6,shade);this.rect(-6,-16,12,2,shade);
  this.rect(-7,-30,14,13,skin);this.rect(-9,-26,18,7,skin);this.rect(-5,-17,10,2,skin);
  this.rect(-11,-24,2,4,skin);this.rect(9,-24,2,4,skin);
  // Swept fringe, rounded crown and little highlights.
  this.rect(-7,-36,13,2,hair);this.rect(-10,-34,19,4,hair);this.rect(-11,-31,5,6,hair);this.rect(7,-31,4,6,hair);
  if(girl){this.rect(-7,-31,6,3,hair);this.rect(-5,-29,3,2,hair);this.rect(5,-29,3,3,hair);this.rect(-9,-32,3,2,shine);this.rect(-11,-20,2,9,shine);this.rect(10,-22,1,11,shine);}
  else{this.rect(-5,-38,8,2,hair);this.rect(-8,-35,5,3,shine);this.rect(-6,-31,8,3,hair);this.rect(-3,-29,4,2,hair);this.rect(3,-32,5,3,hair);this.rect(7,-28,3,3,hair);this.rect(2,-35,4,1,shine);}
  const look=face<0?-1:1,blink=t>0&&Math.floor(t/170)%29===0;
  for(const eye of [-4,3]){this.rect(eye+look,-24,2,blink?1:3,'#4a3833');if(!blink)this.rect(eye+look,-24,1,1,'#fff7e8');}
  this.rect(-8,-21,3,2,'#efaba2');this.rect(6,-21,3,2,'#efaba2');this.rect(-7,-21,1,1,'#f6c2b4');this.rect(7,-21,1,1,'#f6c2b4');
  this.rect(-1+look,-19,1,1,'#9e635a');this.rect(2+look,-19,1,1,'#9e635a');this.rect(look,-18,2,1,'#9e635a');if(girl&&!blink){this.rect(-5+look,-24,1,1,'#4a3833');this.rect(5+look,-24,1,1,'#4a3833');}
  if(girl){
   this.rect(2,-37,5,5,'#ac505e');this.rect(9,-37,5,5,'#ac505e');this.rect(4,-35,3,2,'#e79298');this.rect(9,-35,3,2,'#e79298');this.rect(7,-34,2,3,'#c76977');this.rect(8,-31,2,4,'#c76977');
   if(wedding){this.rect(-8,-33,3,2,'#fff7e7');this.rect(-5,-34,3,2,'#fff7e7');this.rect(-2,-34,3,2,'#fff7e7');this.rect(-5,-33,1,1,'#dfb97b');this.rect(-5,-11,2,4,'#87a080');this.rect(-8,-13,3,3,'#fffef5');this.rect(-5,-14,3,3,'#efd5cd');this.rect(-2,-13,3,3,'#fffef5');}
  }
  if(girl&&outfit===3){
   this.rect(-5,-11,2,5,'#829552');
   this.rect(-8,-13,3,3,'#f2cc55');this.rect(-5,-14,3,3,'#ffe080');this.rect(-2,-13,3,3,'#e9bb40');
   this.rect(-7,-12,1,1,'#b58f32');this.rect(-4,-13,1,1,'#d7aa36');this.rect(-1,-12,1,1,'#ffe99a');
  }
  c.restore();
 }
 arch(x,y){this.rect(x-23,y-42,4,45,'#b9a780');this.rect(x+20,y-42,4,45,'#b9a780');this.rect(x-21,y-45,42,4,'#c7b38c');this.rect(x-17,y-49,34,4,'#c7b38c');for(let i=0;i<9;i++){this.flower(x-23+i*6,y-43-(i>1&&i<7?4:0),i%2?P.white:P.pink);}for(let i=0;i<4;i++){this.flower(x-21,y-34+i*9);this.flower(x+21,y-34+i*9,P.white);}this.rect(x-18,y-41,3,27,'#fff5df');this.rect(x+16,y-41,3,27,'#fff5df');}
 chest(x,y,open=false){this.rect(x-13,y-10,26,16,'#745339');this.rect(x-11,y-8,22,12,'#bd8950');this.rect(x-13,y-16,26,7,'#745339');this.rect(x-10,y-19,20,3,'#745339');this.rect(x-11,y-15,22,5,'#d8a35f');this.rect(x-8,y-16,3,20,'#f3d68b');this.rect(x+5,y-16,3,20,'#f3d68b');this.rect(x-3,y-11,6,7,'#f3d68b');this.rect(x-1,y-9,2,3,'#745339');if(open){this.rect(x-10,y-13,20,5,'#fff5c6');this.rect(x-7,y-27,14,14,'#fffdf6');this.heart(x-3,y-23,1);}}
 draw(s,time){
  const t=s.reduced?0:time;this.rect(0,0,320,240,'#fffdf6');
  this.oval(160,142,153,82,P.light);this.oval(160,144,145,71,P.grass);
  // Small, consistent pixel clusters make the village feel like an embroidered map.
  for(let i=0;i<165;i++){let x=21+(i*73)%281,y=79+(i*37)%118;if(((x-160)/142)**2+((y-145)/71)**2<1){this.rect(x,y,2,1,i%3?'#cad6a6':'#b9ca97');if(i%7===0)this.rect(x+2,y-2,1,3,'#bdcd9d');}}
  const wedding=s.chapter===5, proposal=s.chapter===4;
  const outfit=s.chapter>=4?3:s.chapter===3?2:1;
  if(wedding){
   this.rect(138,96,44,112,'#e8d8b6');this.rect(144,93,32,115,'#f4c8bd');this.rect(148,95,24,112,'#f9dfd1');this.arch(160,102);
   for(let row=0;row<3;row++)for(const side of [-1,1]){const x=160+side*59,y=134+row*24;this.bench(x,y+2);this.character(x,y,'groom',t,false,false,side===-1?1:-1,false,.7);this.character(x+side*20,y,'bride',t,false,false,side===-1?1:-1,false,.7);}
   this.tree(48,99,true);this.tree(268,101,true);for(let i=0;i<5;i++){this.flower(132,116+i*19);this.flower(187,116+i*19,P.white);}
  }else if(proposal){
   this.rect(58,146,198,18,P.edge);this.rect(58,145,198,15,P.path);this.rect(149,129,24,70,P.path);this.arch(167,134);this.bench(66,141);this.bench(259,141);this.tree(55,102,true);this.tree(268,102,true);
   for(let i=0;i<8;i++){let x=70+i*25;this.rect(x,76+Math.round(Math.sin(i/7*Math.PI)*10),26,1,'#bda579');this.rect(x+10,78+Math.round(Math.sin(i/7*Math.PI)*10),3,4,'#f9d88c');}
   for(let i=0;i<8;i++){this.flower(102+i*16,177,P.pink);this.flower(97+i*16,182,P.white);}this.lamp(96,144);this.lamp(230,144);
  }else{
   this.rect(62,119,192,24,P.edge);this.rect(62,118,192,22,P.path);this.rect(91,129,24,59,P.path);this.rect(102,174,115,24,P.path);this.rect(205,129,24,67,P.path);this.rect(145,187,24,29,P.path);
   for(let i=0;i<23;i++)this.rect(68+i*8,125+(i%3)*4,3,1,'#e1cfaa');
   this.house(78,113);this.house(244,109,true);
   this.tree(28,128);this.tree(35,175);this.tree(287,161);this.tree(185,83,true);this.tree(127,91);this.tree(280,96);this.tree(66,210,true);
   this.oval(262,191,30,17,'#b5c5a4');this.oval(264,190,27,14,'#b3d0c6');this.oval(266,188,22,10,'#c8ded1');this.rect(252,186,10,1,'#e7eee0');this.rect(268,192,13,1,'#e7eee0');
   this.bench(163,122);this.lamp(132,143);this.lamp(241,148);
   for(let i=0;i<13;i++){this.flower(187+(i%5)*8,151+Math.floor(i/5)*7,i%2?P.white:P.pink);}
   for(let i=0;i<12;i++)this.flower(89+(i*17)%142,210+(i%3)*4,i%3?P.pink:P.white);
   // cafe table, camera on tripod, and a small ribboned mailbox
   this.rect(59,126,16,4,'#b49167');this.rect(63,130,2,7,P.bark);this.rect(70,130,2,7,P.bark);this.rect(61,121,4,5,P.cream);this.rect(69,121,4,5,P.cream);
   this.rect(167,167,2,13,P.bark);this.rect(163,179,3,2,P.bark);this.rect(170,179,3,2,P.bark);this.rect(160,161,15,9,P.ink);this.rect(164,159,5,2,P.ink);this.rect(165,163,5,5,'#c1ccba');this.rect(166,164,3,3,'#6d8077');
   this.rect(44,137,2,13,P.bark);this.rect(39,132,12,7,P.rose);this.rect(41,134,8,1,P.cream);
  }
  // Character depth follows Y. The companion begins following only after the greeting.
  const pair=[{...s.player,kind:'groom',walking:s.moving}];
  if(s.chapter!==1||s.title)pair.push({...s.partner,kind:'bride',walking:s.joined&&s.moving});
  else {this.character(235,125,'bride',t,false,false,-1,false,1,outfit);this.rect(242,109,5,4,P.cream);}
  pair.sort((a,b)=>a.y-b.y).forEach(p=>this.character(p.x,p.y,p.kind,t,p.walking,wedding,p.kind==='groom'?s.facing:-1,s.proposalStep===1&&p.kind==='groom',1,outfit));
  if(s.joined&&Math.abs(s.player.x-s.partner.x)<34&&Math.abs(s.player.y-s.partner.y)<8){const left=Math.min(s.player.x,s.partner.x)+9,right=Math.max(s.player.x,s.partner.x)-9;this.rect(left,s.player.y-8,Math.max(2,Math.round(right-left)),2,'#efbc9f');this.rect((left+right)/2-1,s.player.y-9,3,3,'#ffe0bf');}
  if(s.effect&&time<s.effect.until){const n=s.reduced?0:Math.floor((time-s.effect.start)/170)%4;this.heart(s.player.x-1,s.player.y-48-n*2);if(s.effect.kind==='photo'){this.rect(s.partner.x+8,s.partner.y-34,3,3,P.cream);this.rect(s.partner.x+9,s.partner.y-37,1,9,P.cream);}if(s.effect.kind==='cafe'){this.rect(s.player.x+4,s.player.y-15,4,4,P.cream);this.rect(s.partner.x-7,s.partner.y-15,4,4,P.cream);}}
  if(s.proposalStep===1){this.rect(s.player.x+10,s.player.y-13,4,4,'#d9b264');this.rect(s.player.x+11,s.player.y-12,2,2,P.cream);this.rect(s.player.x+11,s.player.y-15,2,2,'#fffdf6');}
  if(wedding||s.proposalStep===2){for(let i=0;i<19;i++){let x=54+(i*47)%221,y=70+((i*31+(s.reduced?0:t/55))%133);this.rect(x,y,2,3,i%3?P.pink:P.white);}}
  if(s.title){this.heart(155,133,1,'#d69894');}
 }
}
