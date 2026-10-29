const $=id=>document.getElementById(id);
let mobile='ontouchstart' in window,kit='axe',playing=false,invOpen=false,T=0;
const R=new THREE.WebGLRenderer({antialias:true});R.setSize(innerWidth,innerHeight);R.setPixelRatio(Math.min(devicePixelRatio,2));document.body.appendChild(R.domElement);
const S=new THREE.Scene();S.background=new THREE.Color(0x87ceeb);S.fog=new THREE.Fog(0x87ceeb,40,120);
const C=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,.1,200);C.rotation.order='YXZ';
S.add(new THREE.AmbientLight(0xffffff,.75));const DL=new THREE.DirectionalLight(0xffffff,.6);DL.position.set(30,60,20);S.add(DL);
addEventListener('resize',()=>{R.setSize(innerWidth,innerHeight);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix()});
const ground=new THREE.Mesh(new THREE.PlaneGeometry(50,50),new THREE.MeshLambertMaterial({color:0x5aa85a}));ground.rotation.x=-Math.PI/2;S.add(ground);
const grid=new THREE.GridHelper(50,50,0x3e7d3e,0x3e7d3e);grid.position.y=.02;S.add(grid);
// blocks
const BG=new THREE.BoxGeometry(1,1,1),blocks=new Map(),solids=[ground];
const MC={stone:0x9e9e9e,wood:0x9c6b3f,red:0xe53935,blue:0x1e88e5,gold:0xffc107,green:0x43a047,white:0xeeeeee,bed:0xff4081},MT={};
for(const k in MC)MT[k]=new THREE.MeshLambertMaterial({color:MC[k]});
function addB(x,y,z,t){const k=x+','+y+','+z;if(blocks.has(k))return;const m=new THREE.Mesh(BG,MT[t||'stone']);m.position.set(x+.5,y+.5,z+.5);m.userData.c=[x,y,z];S.add(m);blocks.set(k,m);solids.push(m)}
function delB(m){const c=m.userData.c;if(m.userData.bed&&!clr){bedOn[m.userData.bed-1]=0;msg(TN[m.userData.bed-1]+' bed destroyed!')}blocks.delete(c.join(','));solids.splice(solids.indexOf(m),1);S.remove(m)}
function solid(x,y,z){return(groundOn&&y<0&&x>=-25&&x<25&&z>=-25&&z<25)||blocks.has(x+','+y+','+z)}
const XS=[0,0,1,0,-1,0,1,1,0,-1,-1,0,1,0,-1,0],TC=[0xe53935,0x1e88e5,0x43a047,0xfdd835],TN=['Red','Blue','Green','Yellow'],TP=[[0,22],[0,-22],[22,0],[-22,0]],TM=['red','blue','green','gold'];
let mode='ffa',groundOn=true,cps=[],FIN=null,cp={x:0,y:0,z:8},over=0,clr=false,bedOn=[1,1,1,1],bedCell=[];const pk={s:0,d:0};
function build(m){clr=true;for(const b of [...blocks.values()])delB(b);clr=false;crys.splice(0).forEach(c=>S.remove(c));
 bots.forEach(b=>S.remove(b.g));bots.length=0;botGroups.length=0;cps=[];pk.s=pk.d=0;groundOn=m==='ffa';ground.visible=grid.visible=groundOn;
 if(m==='ffa'){for(const[x,z]of[[7,-7],[-8,-7],[7,8],[-8,8]])for(let y=0;y<3;y++)addB(x,y,z,'wood');
  if(mp==='solo'){mkBot(10,-10);mkBot(-12,-8);mkBot(12,12);mkBot(-10,12)}}
 if(m==='pk'){cps=[{x:.5,y:1,z:-29.5}];for(let x=-1;x<=1;x++)for(let z=-31;z<=-29;z++)addB(x,0,z,'blue');
  for(let i=1;i<=15;i++){const x=XS[i],y=Math.floor(i/3),z=-31-3*i;addB(x,y,z,i==15?'gold':i%5==0?'green':(i%2?'red':'white'));if(i%5==0)cps.push({x:x+.5,y:y+1,z:z+.5})}
  FIN=cps[cps.length-1];cp=cps[0]}
 if(m==='bw'){bedOn=[1,1,1,1];bedCell=[];
  for(let t=0;t<4;t++){const cx=TP[t][0],cz=TP[t][1];for(let x=-2;x<=2;x++)for(let z=-2;z<=2;z++)addB(cx+x,-1,cz+z,TM[t]);
   addB(cx,0,cz,'bed');blocks.get(cx+',0,'+cz).userData.bed=t+1;bedCell[t]=cx+',0,'+cz;
   for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1],[0,0]])addB(cx+a,a==0&&b==0?1:0,cz+b,'wood')}
  for(let x=-3;x<=3;x++)for(let z=-3;z<=3;z++)addB(x,-1,z,'stone');addB(0,0,0,'gold');
  for(let t=1;t<4;t++)mkBot(TP[t][0]+2,TP[t][1],TC[t],t)}}
// player
const P=new THREE.Vector3(0,0,8);let vx=0,vy=0,vz=0,yaw=0,pitch=0,onG=false,peak=0,hp=20,atkCd=0,useHeld=false,jumpHeld=false,jx=0,jy=0;
function hit(){for(let x=Math.floor(P.x-.3);x<=Math.floor(P.x+.3);x++)for(let y=Math.floor(P.y);y<=Math.floor(P.y+1.79);y++)for(let z=Math.floor(P.z-.3);z<=Math.floor(P.z+.3);z++)if(solid(x,y,z))return true;return false}
function resp(){riding=false;vx=vy=vz=0;
 if(mode==='bw'){if(!bedOn[0]){endGame('Eliminated! Your bed was destroyed');return}P.set(TP[0][0]+2.5,0,TP[0][1]+.5)}
 else if(mode==='pk')P.set(cp.x,cp.y,cp.z);else{P.set(0,0,8);streak=0;giveKit()}peak=P.y}
function giveKit(){inv=Array(36).fill(null);KITS[kit].forEach((k,i)=>inv[i]={n:k[0],c:k[1]});sel=0;draw()}
function endGame(t){if(over)return;over=1;playing=false;document.exitPointerLock();$('mt').textContent=t;$('menu').style.display='flex'}
// inventory
const IT={axe:{e:'🪓',max:1},mace:{e:'🔨',max:1},sword:{e:'🗡️',max:1},spear:{e:'🔱',max:1},shield:{e:'🛡️',max:1},gapple:{e:'🍎',max:16},block:{e:'🟫',max:64},crystal:{e:'💎',max:16},iron:{e:'🔩',max:64},gold:{e:'🪙',max:64},cart:{e:'🛒',max:4}};
const KITS={axe:[['axe',1],['shield',1],['gapple',4],['block',32]],mace:[['mace',1],['shield',1],['gapple',4],['block',32]],
 crystal:[['sword',1],['crystal',12],['shield',1],['gapple',4],['block',32]],spear:[['spear',1],['shield',1],['gapple',4],['block',32]],
 uhc:[['sword',1],['shield',1],['gapple',8],['block',64]],cart:[['sword',1],['cart',3],['shield',1],['gapple',4],['block',32]]};
let inv=Array(36).fill(null),sel=0,held=null;const sl=[];
for(let i=0;i<36;i++){const d=document.createElement('div');d.className='s';d.onclick=()=>clickSlot(i);sl.push(d);(i<9?$('hb'):$('gr')).appendChild(d)}
function draw(){sl.forEach((d,i)=>{const s=inv[i];d.className='s'+(i==sel?' on':'')+(i==held?' hold':'');d.textContent=s?IT[s.n].e+(s.c>1?' '+s.c:''):''})}
function clickSlot(i){if(!invOpen){if(i<9){sel=i;draw()}return}
 if(held===null){if(inv[i])held=i}else{const t=inv[held];inv[held]=inv[i];inv[i]=t;held=null}draw()}
function give(n,c){const m=IT[n].max;for(const s of inv)if(s&&s.n===n&&s.c<m){s.c+=c;draw();return}const i=inv.findIndex(s=>!s);if(i>=0)inv[i]={n,c};draw()}
function take(i){inv[i].c--;if(!inv[i].c)inv[i]=null;draw()}
function toggleInv(){if(invOpen&&$('shop').style.display==='flex')return;invOpen=!invOpen;$('inv').style.display=invOpen?'flex':'none';held=null;draw();
 if(!mobile){if(invOpen)document.exitPointerLock();else R.domElement.requestPointerLock()}}
const SH=[['Blocks x16','iron',4,'block',16],['Sword','iron',8,'sword',1],['Axe','iron',18,'axe',1],['Shield','iron',10,'shield',1],['Cart','iron',12,'cart',1],['Golden apple','gold',2,'gapple',1],['Mace','gold',6,'mace',1],['Crystals x2','gold',4,'crystal',2]];
function cnt(n){let c=0;for(const s of inv)if(s&&s.n===n)c+=s.c;return c}
function spend(n,c){for(let i=0;i<36&&c>0;i++){const s=inv[i];if(s&&s.n===n){const t=Math.min(c,s.c);s.c-=t;c-=t;if(!s.c)inv[i]=null}}}
function drawShop(){$('shop').innerHTML='<div>Shop: '+cnt('iron')+' iron, '+cnt('gold')+' gold (stand on your island or the middle to earn)</div>'+SH.map((x,i)=>'<button data-i="'+i+'">'+x[0]+' ('+x[2]+' '+x[1]+')</button>').join('')+'<button id="sx">Close</button>'}
$('shop').onclick=e=>{const i=e.target.dataset.i;if(i!==undefined){const x=SH[i];if(cnt(x[1])>=x[2]){spend(x[1],x[2]);give(x[3],x[4]);drawShop()}else msg('Not enough '+x[1])}else if(e.target.id==='sx')toggleShop()};
function toggleShop(){if(mode!=='bw'||!playing||(invOpen&&$('shop').style.display!=='flex'))return;invOpen=!invOpen;$('shop').style.display=invOpen?'flex':'none';if(invOpen)drawShop();draw();
 if(!mobile){if(invOpen)document.exitPointerLock();else R.domElement.requestPointerLock()}}
$('closeinv').onclick=()=>{if(invOpen)toggleInv()};
// bots
const bots=[],botGroups=[];
function mkBot(x,z,col,t){const g=new THREE.Group(),bm=new THREE.MeshLambertMaterial({color:col||0xc62828});
 const body=new THREE.Mesh(new THREE.BoxGeometry(.8,1.4,.45),bm);body.position.y=.7;g.add(body);
 const head=new THREE.Mesh(new THREE.BoxGeometry(.5,.5,.5),new THREE.MeshLambertMaterial({color:0xffcc99}));head.position.y=1.6;g.add(head);
 const sh=new THREE.Mesh(new THREE.BoxGeometry(.9,1,.1),new THREE.MeshLambertMaterial({color:0x1e88e5}));sh.position.set(0,1,.5);sh.visible=false;g.add(sh);
 g.position.set(x,0,z);const b={g,bm,sh,col:col||0xc62828,t:t,hp:20,cd:0,blockUntil:0,nextBlock:3,disUntil:0,dead:false,respawn:0,on:false};g.userData.bot=b;S.add(g);bots.push(b);botGroups.push(g)}
// combat
const rc=new THREE.Raycaster();let mt;
function msg(t){$('msg').textContent=t;clearTimeout(mt);mt=setTimeout(()=>$('msg').textContent='',1800)}
function aim(reach){C.updateMatrixWorld();rc.setFromCamera({x:0,y:0},C);rc.far=reach;return{bh:rc.intersectObjects(botGroups.concat(remG),true)[0],kh:rc.intersectObjects(solids,false)[0],ch:rc.intersectObjects(crys,false)[0]}}
function hurt(d,raw){if(!raw&&inv[sel]&&inv[sel].n==='shield'&&useHeld&&T>=myDis)d*=.2;hp-=d;$('fl').style.opacity=.5;setTimeout(()=>$('fl').style.opacity=0,130);if(hp<=0){msg('You died');if(lastHit){net({t:'kill',to:lastHit});lastHit=null}resp();hp=20}}
const W={axe:[7,.8,3.5],mace:[3,1.1,3.5],spear:[4,.9,5],sword:[6,.55,3.5]},crys=[],remG=[],rem={};let riding=false,cartHP=0,borderR=25,bs=0,bn=0,atkMax=1,useCd=0,myDis=0,kills=0,streak=0,lastHit=null,gi=0,gg=0;
const cartM=new THREE.Mesh(new THREE.BoxGeometry(1.1,.6,1.5),new THREE.MeshLambertMaterial({color:0x607d8b}));cartM.visible=false;S.add(cartM);
const ring=new THREE.Mesh(new THREE.CylinderGeometry(1,1,14,48,1,true),new THREE.MeshBasicMaterial({color:0xff3d00,transparent:true,opacity:.25,side:THREE.DoubleSide}));ring.visible=false;ring.position.y=6;S.add(ring);
function dmgBot(b,d,m){b.hp-=d;msg((m||'')+Math.round(d)+' dmg, bot '+Math.max(0,Math.ceil(b.hp))+' hp');if(b.hp<=0){b.dead=true;b.g.visible=false;b.respawn=T+3;give('gapple',1);kills++;streak++}}
function hitBot(b){const it=inv[sel]&&inv[sel].n,air=!onG,fall=Math.max(0,peak-P.y),rd=riding;let d=(W[it]||[1])[0],m='';
 if((it==='mace'||it==='spear')&&air&&vy<-1){d=it==='mace'?6+fall*2.5:4+fall*1.2;m='SMASH! ';peak=P.y}
 if(rd){d*=1.5;m+='Cart hit! ';if(--cartHP<=0){riding=false}}
 if(b.on){if(it==='axe'&&air){b.disUntil=T+5;m='Shield disabled for 5s! '}d*=.1}
 b.g.position.addScaledVector(b.g.position.clone().sub(P).setY(0).normalize(),rd?1.6:.8);dmgBot(b,d,m)}
function hitRem(id){if(!rem[id])return;const it=inv[sel]&&inv[sel].n,air=!onG,fall=Math.max(0,peak-P.y);let d=(W[it]||[1])[0];
 if((it==='mace'||it==='spear')&&air&&vy<-1){d=it==='mace'?6+fall*2.5:4+fall*1.2;peak=P.y}
 if(riding){d*=1.5;if(--cartHP<=0)riding=false}
 net({t:'hit',to:id,d:d,dis:it==='axe'&&air?1:0});msg(Math.round(d)+' dmg')}
function boom(c){const p=c.position.clone();S.remove(c);crys.splice(crys.indexOf(c),1);
 const f=new THREE.Mesh(new THREE.SphereGeometry(2.5,12,8),new THREE.MeshBasicMaterial({color:0xff9800,transparent:true,opacity:.6}));f.position.copy(p);S.add(f);setTimeout(()=>S.remove(f),180);
 for(const b of bots){if(b.dead)continue;const d=b.g.position.clone().add(new THREE.Vector3(0,.9,0)).distanceTo(p);if(d<5)dmgBot(b,(b.on?.4:1)*18*(1-d/5),'BOOM! ')}
 const dp=P.clone().add(new THREE.Vector3(0,.9,0)).distanceTo(p);if(dp<5)hurt(12*(1-dp/5));
 for(const m of [...blocks.values()])if(m.position.distanceTo(p)<2.2)delB(m)}
function attack(){if(atkCd>0||!playing||invOpen)return;const it=inv[sel]&&inv[sel].n,w=W[it]||[1,.35,3.5];atkCd=atkMax=w[1];
 const{bh,kh,ch}=aim(Math.max(w[2],4.5)),bd=bh?bh.distance:1e9,kd=kh?kh.distance:1e9,cd=ch?ch.distance:1e9;
 if(cd<bd&&cd<kd){boom(ch.object);return}
 if(bd<=w[2]&&bd<=kd){let o=bh.object;while(o&&!o.userData.bot&&!o.userData.rid)o=o.parent;if(o&&o.userData.bot)hitBot(o.userData.bot);else if(o)hitRem(o.userData.rid);return}
 if(kh&&kh.distance<=5&&kh.object!==ground){const u=kh.object.userData;if(u.bed===1){msg('That is your bed!');return}net({t:'b',a:0,c:u.c});delB(kh.object);give('block',1)}}
function use(){const it=inv[sel];if(!it||!playing||invOpen||T<useCd)return;useCd=T+(it.n==='gapple'?1:.35);
 if(it.n==='gapple'){if(hp<20){hp=Math.min(20,hp+8);take(sel);msg('Healed')}}
 else if(it.n==='cart'){if(!riding){riding=true;cartHP=4;take(sel);msg('Riding! Jump to get off')}}
 else if(it.n==='block'||it.n==='crystal'){const{kh}=aim(5);if(!kh)return;const n=kh.face.normal.clone().transformDirection(kh.object.matrixWorld);
  const x=Math.floor(kh.point.x+n.x*.5),y=Math.floor(kh.point.y+n.y*.5),z=Math.floor(kh.point.z+n.z*.5),k=x+','+y+','+z;
  if(y<0||blocks.has(k))return;
  if(it.n==='block'){addB(x,y,z,'wood');if(hit())delB(blocks.get(k));else{take(sel);net({t:'b',a:1,c:[x,y,z],ty:'wood'})}}
  else{const c=new THREE.Mesh(new THREE.OctahedronGeometry(.35),new THREE.MeshBasicMaterial({color:0xe040fb}));c.position.set(x+.5,y+.45,z+.5);S.add(c);crys.push(c);take(sel)}}}
// input: PC
const K={};
addEventListener('keydown',e=>{K[e.code]=1;if(!playing)return;if(e.code==='KeyE')toggleInv();if(e.code==='KeyB')toggleShop();const n=+e.key;if(n>=1&&n<=9){sel=n-1;draw()}});
addEventListener('keyup',e=>K[e.code]=0);
addEventListener('wheel',e=>{if(playing&&!invOpen){sel=(sel+(e.deltaY>0?1:8))%9;draw()}});
document.addEventListener('mousemove',e=>{if(document.pointerLockElement===R.domElement){yaw-=e.movementX*.0025;pitch=Math.max(-1.5,Math.min(1.5,pitch-e.movementY*.0025))}});
R.domElement.addEventListener('mousedown',e=>{if(mobile||!playing||invOpen)return;if(document.pointerLockElement!==R.domElement){R.domElement.requestPointerLock();return}
 if(e.button==0)attack();if(e.button==2){useHeld=true;use()}});
addEventListener('mouseup',e=>{if(e.button==2)useHeld=false});
addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('pointerlockchange',()=>{if(!mobile&&playing&&!invOpen)$('pause').style.display=document.pointerLockElement===R.domElement?'none':'flex'});
$('pause').onclick=()=>{R.domElement.requestPointerLock()};
// input: touch
let joyId=null,lookId=null,lx=0,ly=0;const BT={};
function act(a,d){if(a==='jump')jumpHeld=!!d;else if(a==='hit'){if(d)attack()}else if(a==='use'){useHeld=!!d;if(d)use()}else if(a==='inv'&&d)toggleInv();else if(a==='shop'&&d)toggleShop()}
function joyMove(t){const r=$('joy').getBoundingClientRect(),dx=t.clientX-(r.left+r.width/2),dy=t.clientY-(r.top+r.height/2),m=Math.hypot(dx,dy)||1,l=Math.min(1,m/55);
 jx=dx/m*l;jy=dy/m*l;$('knob').style.transform='translate('+jx*45+'px,'+jy*45+'px)'}
document.addEventListener('touchstart',e=>{if(!mobile||!playing)return;for(const t of e.changedTouches){const el=document.elementFromPoint(t.clientX,t.clientY);if(!el)continue;const b=el.closest('.b');
 if(b){e.preventDefault();BT[t.identifier]=b.dataset.a;act(b.dataset.a,1)}
 else if(el.closest('#joy')){e.preventDefault();joyId=t.identifier;joyMove(t)}
 else if(!el.closest('#hb,#inv')&&lookId===null&&!invOpen){lookId=t.identifier;lx=t.clientX;ly=t.clientY}}},{passive:false});
document.addEventListener('touchmove',e=>{if(!mobile||!playing)return;for(const t of e.changedTouches){
 if(t.identifier===joyId)joyMove(t);
 if(t.identifier===lookId){yaw-=(t.clientX-lx)*.005;pitch=Math.max(-1.5,Math.min(1.5,pitch-(t.clientY-ly)*.005));lx=t.clientX;ly=t.clientY}}e.preventDefault()},{passive:false});
function endT(e){for(const t of e.changedTouches){if(t.identifier===joyId){joyId=null;jx=jy=0;$('knob').style.transform=''}
 if(t.identifier===lookId)lookId=null;if(BT[t.identifier]){act(BT[t.identifier],0);delete BT[t.identifier]}}}
document.addEventListener('touchend',endT);document.addEventListener('touchcancel',endT);
// menu
function pickCtl(m){mobile=m;$('cPC').className=m?'':'sel';$('cTouch').className=m?'sel':''}
$('cPC').onclick=()=>pickCtl(false);$('cTouch').onclick=()=>pickCtl(true);pickCtl(mobile);
document.querySelectorAll('.kit').forEach(b=>b.onclick=()=>{kit=b.dataset.k;document.querySelectorAll('.kit').forEach(x=>x.className='kit'+(x===b?' sel':''))});
document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{mode=b.dataset.m;document.querySelectorAll('.mode').forEach(x=>x.className='mode'+(x===b?' sel':''))});
document.querySelectorAll('.mp').forEach(b=>b.onclick=()=>{mp=b.dataset.p;document.querySelectorAll('.mp').forEach(x=>x.className='mp'+(x===b?' sel':''));
 $('mpbox').style.display=mp==='solo'?'none':'block';$('code').style.display=mp==='join'?'inline-block':'none';
 if(peer&&mp!=='host'){peer.destroy();peer=null;conns=[];rdy=false;host=false}if(mp==='host'&&!peer)startNet('host')});
$('play').onclick=()=>{if(mp==='join'&&!rdy){if(!peer)startNet('join',$('code').value.trim().toUpperCase());$('mps').textContent='Connecting...';return}
 if(mp==='host'&&!rdy){$('mps').textContent='Setting up room...';return}startGame()};
function startGame(){if(mode==='bw'&&mp!=='solo'){$('mps').textContent='Bedwars is solo vs bots for now';return}
 hp=20;kills=0;streak=0;over=0;myDis=0;gi=gg=0;$('mt').textContent='Block Brawl';giveKit();
 document.body.classList.toggle('mob',mobile);document.body.classList.toggle('bw',mode==='bw');$('menu').style.display='none';
 build(mode);riding=false;borderR=25;bs=performance.now()/1000;bn=0;
 if(mode==='bw')P.set(TP[0][0]+2.5,0,TP[0][1]+.5);else if(mode==='pk')P.set(cp.x,cp.y,cp.z);else P.set(0,0,8);
 vx=vy=vz=0;peak=P.y;playing=true;if(!mobile)R.domElement.requestPointerLock()}
// loop
function update(dt){atkCd-=dt;let f=0,r=0;
 if(!mobile){f=(K.KeyW?1:0)-(K.KeyS?1:0);r=(K.KeyD?1:0)-(K.KeyA?1:0)}else{f=-jy;r=jx}
 const l=Math.hypot(f,r);if(l>1){f/=l;r/=l}
 const s=Math.sin(yaw),c=Math.cos(yaw);vx=(-s*f+c*r)*5;vz=(-c*f-s*r)*5;
 if(riding){if(K.Space||jumpHeld)riding=false;else{vx=-s*10;vz=-c*10}}
 if((K.Space||jumpHeld)&&onG){vy=8;onG=false}
 vy=Math.max(vy-24*dt,-30);
 P.x+=vx*dt;if(hit())P.x-=vx*dt;
 P.z+=vz*dt;if(hit())P.z-=vz*dt;
 P.y+=vy*dt;onG=false;if(hit()){P.y-=vy*dt;if(vy<0)onG=true;vy=0}
 if(onG)peak=P.y;else if(P.y>peak)peak=P.y;
 if(P.y<-12){resp()}
 // parkour
 if(P.z<-33&&!pk.s&&!pk.d)pk.s=T;if(P.z>-27){pk.s=0;pk.d=0}
 if(onG){for(const q of cps)if(Math.hypot(P.x-q.x,P.z-q.z)<.7&&Math.abs(P.y-q.y)<.3&&cp!==q){cp=q;msg('Checkpoint')}
  if(pk.s&&!pk.d&&Math.hypot(P.x-FIN.x,P.z-FIN.z)<1&&Math.abs(P.y-FIN.y)<.3){pk.d=T-pk.s;msg('Finished in '+pk.d.toFixed(2)+'s!')}}
 // bots
 for(const b of bots){if(b.dead){if(T>b.respawn&&(mode!=='bw'||bedOn[b.t])){b.dead=false;b.hp=20;b.g.visible=true;if(mode==='bw')b.g.position.set(TP[b.t][0]+2,0,TP[b.t][1]);else b.g.position.set((Math.random()-.5)*30,0,(Math.random()-.5)*30)}continue}
  const dx=P.x-b.g.position.x,dz=P.z-b.g.position.z,d=Math.hypot(dx,dz),bw=mode==='bw';let tx=dx,tz=dz,td=d;
  if(bw&&d>9&&bedOn[0]){tx=TP[0][0]+.5-b.g.position.x;tz=TP[0][1]+.5-b.g.position.z;td=Math.hypot(tx,tz)}
  if((bw||P.z>-15)&&d<(bw?250:30)&&td>1.7){b.g.position.x+=tx/td*2.6*dt;b.g.position.z+=tz/td*2.6*dt;if(bw)addB(Math.floor(b.g.position.x),-1,Math.floor(b.g.position.z),'white')}
  if(bw&&bedOn[0]&&d>9&&td<4&&T>(b.brk||0)){b.brk=T+1.2;let bm=null,bd2=3;for(const m of blocks.values())if(!m.userData.bed&&m.userData.c[1]>=0){const q=m.position.distanceTo(b.g.position);if(q<bd2){bd2=q;bm=m}}if(bm)delB(bm)}
  if(bw&&bedOn[0]&&d>9&&td<2.2){const m=blocks.get(bedCell[0]);if(m)delB(m)}
  b.g.rotation.y=Math.atan2(tx,tz);
  if(T>b.blockUntil&&T>b.nextBlock&&d<5){b.blockUntil=T+1.6;b.nextBlock=T+4}
  b.on=T<b.blockUntil&&T>=b.disUntil;b.sh.visible=b.on;b.bm.color.setHex(T<b.disUntil?0xffee58:b.col);
  for(const c of [...crys])if(c.position.distanceTo(b.g.position.clone().setY(.5))<1.4)boom(c);if(b.dead)continue;
  if(riding&&d<1.7&&T>(b.ram||0)){b.ram=T+.8;b.g.position.addScaledVector(new THREE.Vector3(dx,0,dz).normalize(),-2.5);dmgBot(b,b.on?1:7,'Rammed! ');if(--cartHP<=0)riding=false;if(b.dead)continue}
  if((bw||P.z>-15)&&d<2.2&&T>b.cd&&!b.on){b.cd=T+1.1;hurt(3+Math.random()*2)}}
 if(mode==='bw'){if(!over&&bots.every(b=>b.dead&&!bedOn[b.t]))endGame('Victory! You won Bedwars');if(Math.hypot(P.x-TP[0][0],P.z-TP[0][1])<8&&T>gi){gi=T+1.6;give('iron',1)}if(Math.hypot(P.x,P.z)<5&&T>gg){gg=T+7;give('gold',1)}}
 $('cdb').firstChild.style.width=(1-Math.max(0,atkCd)/atkMax)*100+'%';document.querySelector('.b[data-a=hit]').style.setProperty('--f',Math.max(0,atkCd)/atkMax*100+'%');
 if(kit==='uhc'&&mode==='ffa'){borderR=Math.max(8,25-(T-bs)*.19);ring.visible=true;ring.scale.set(borderR,1,borderR);if(P.z>-15&&Math.hypot(P.x,P.z)>borderR&&T>bn){bn=T+1;hp-=1.5;msg('Outside the border!');if(hp<=0){msg('You died');resp();hp=20}}}else ring.visible=false;
 cartM.visible=riding;if(riding){cartM.position.set(P.x,P.y+.3,P.z);cartM.rotation.y=yaw}
 const it=inv[sel];
 $('hud').textContent='❤ '+Math.ceil(hp)+'   '+(it?IT[it.n].e+' '+it.n:'empty hand')+(it&&it.n==='shield'&&useHeld?' (blocking)':'')+(riding?'   Cart '+cartHP:'')+(kit==='uhc'&&mode==='ffa'?'   Border '+borderR.toFixed(0):'')+(mode==='bw'?'   Beds '+bedOn.map((o,i)=>o?TN[i][0]:'x').join(' '):'')+(mode==='ffa'?'   Kills '+kills:'')+(conns.length?'   Online '+(Object.keys(rem).length+1):'')+
  (pk.d?'   Parkour: '+pk.d.toFixed(2)+'s':pk.s?'   Parkour: '+(T-pk.s).toFixed(1)+'s':'')}
let last=performance.now();
function loop(now){requestAnimationFrame(loop);const dt=Math.min((now-last)/1000,.033);last=now;T=now/1000;
 if(playing&&!invOpen)update(dt);
 if(conns.length&&playing&&now-ns>66){ns=now;net({t:'s',p:[+P.x.toFixed(2),+P.y.toFixed(2),+P.z.toFixed(2)],y:+yaw.toFixed(2),b:(inv[sel]&&inv[sel].n==='shield'&&useHeld&&T>=myDis)?1:0})}
 for(const id in rem){const r=rem[id];if(r.tp)r.g.position.lerp(new THREE.Vector3(r.tp[0],r.tp[1],r.tp[2]),.35);r.g.rotation.y=r.ry+Math.PI}
 C.position.set(P.x,P.y+1.62,P.z);C.rotation.set(pitch,yaw,0);R.render(S,C)}
requestAnimationFrame(loop);
