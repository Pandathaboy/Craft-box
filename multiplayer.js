// multiplayer (PeerJS)
let peer=null,conns=[],myId='bb-'+Math.random().toString(36).slice(2,7),mp='solo',host=false,rdy=false,ns=0;
const RC=[0xe53935,0x1e88e5,0x43a047,0xfdd835,0x8e24aa,0xff7043];
function mkAv(c){const g=new THREE.Group(),b=new THREE.Mesh(new THREE.BoxGeometry(.8,1.4,.45),new THREE.MeshLambertMaterial({color:c}));b.position.y=.7;
 const h=new THREE.Mesh(new THREE.BoxGeometry(.5,.5,.5),new THREE.MeshLambertMaterial({color:0xffcc99}));h.position.y=1.6;
 const sh=new THREE.Mesh(new THREE.BoxGeometry(.9,1,.1),new THREE.MeshLambertMaterial({color:0x1e88e5}));sh.position.set(0,1,.5);sh.visible=false;g.add(b,h,sh);S.add(g);return{g,sh,tp:null,ry:0}}
function dropRem(id){const r=rem[id];if(r){S.remove(r.g);remG.splice(remG.indexOf(r.g),1);delete rem[id]}}
function net(m){if(!conns.length)return;m.f=myId;for(const c of conns)if(c.open)c.send(m)}
function onMsg(m,from){if(from&&!from.rid)from.rid=m.f;if(host)for(const c of conns)if(c!==from&&c.open)c.send(m);
 if(m.t==='s'){let r=rem[m.f];if(!r){r=rem[m.f]=mkAv(RC[Object.keys(rem).length%6]);r.g.userData.rid=m.f;remG.push(r.g);r.g.position.set(m.p[0],m.p[1],m.p[2])}r.tp=m.p;r.ry=m.y;r.sh.visible=!!m.b}
 else if(m.t==='b'){const k=m.c;if(m.a)addB(k[0],k[1],k[2],m.ty);else{const b=blocks.get(k.join(','));if(b)delB(b)}}
 else if(m.t==='hit'&&m.to===myId&&playing){hurt(m.d);lastHit=m.f;if(m.dis){myDis=T+5;msg('Your shield was disabled for 5s!')}}
 else if(m.t==='kill'&&m.to===myId){kills++;msg('You got a kill!')}
 else if(m.t==='left')dropRem(m.id)}
function gone(c){conns=conns.filter(x=>x!==c);if(c.rid){dropRem(c.rid);if(host)net({t:'left',id:c.rid})}if(!host){msg('Host left the room')}}
function startNet(kind,code){if(typeof Peer==='undefined'){$('mps').textContent='Multiplayer library failed to load';return}
 if(kind==='host'){const room=Math.random().toString(36).slice(2,6).toUpperCase();host=true;peer=new Peer('blockbrawl-'+room);
  peer.on('open',()=>{rdy=true;$('mps').textContent='Room code: '+room+' (share it, then press Play)'});
  peer.on('connection',c=>{conns.push(c);c.on('data',m=>onMsg(m,c));c.on('close',()=>gone(c))})}
 else{peer=new Peer();peer.on('open',()=>{const c=peer.connect('blockbrawl-'+code);
  c.on('open',()=>{conns=[c];rdy=true;$('mps').textContent='Connected!';startGame()});c.on('data',m=>onMsg(m,c));c.on('close',()=>gone(c))})}
 peer.on('error',e=>{$('mps').textContent='Network error: '+e.type;if(kind==='join'){peer=null;rdy=false}})}
