/* Echoes of the Unwritten — procedural 3D world renderer, build 0.5.0
   Three.js is loaded from jsDelivr by index.html. All meshes are original procedural geometry. */
(() => {
  'use strict';
  const THREE = window.THREE;
  if (!THREE) { const fallback=document.getElementById('gameCanvas'); if(fallback) fallback.style.opacity='1'; console.error('Three.js failed to load; using the 2D fallback.'); return; }
  const wrap = document.querySelector('.canvas-wrap');
  const oldCanvas = document.getElementById('gameCanvas');
  const canvas = document.createElement('canvas');
  canvas.id = 'world3dCanvas'; canvas.setAttribute('aria-label','Three-dimensional world of Echoes of the Unwritten');
  wrap.insertBefore(canvas, oldCanvas.nextSibling);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false, powerPreference:'high-performance'}); }
  catch (err) { oldCanvas.style.opacity='1'; canvas.remove(); console.error('WebGL unavailable; using the 2D fallback.',err); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setSize(Math.max(1,wrap.clientWidth), Math.max(1,wrap.clientHeight), false);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#111827'); scene.fog = new THREE.FogExp2('#111827', .00112);
  const camera = new THREE.PerspectiveCamera(49, Math.max(1,wrap.clientWidth)/Math.max(1,wrap.clientHeight), .1, 2600);
  const hemi = new THREE.HemisphereLight('#9aa9ff','#101722',2.0); scene.add(hemi);
  const moon = new THREE.DirectionalLight('#c4ccff',3.0); moon.position.set(-280,500,-160); moon.castShadow=true; moon.shadow.mapSize.set(1024,1024); moon.shadow.camera.left=-430; moon.shadow.camera.right=430; moon.shadow.camera.top=430; moon.shadow.camera.bottom=-430; scene.add(moon);
  const warm = new THREE.PointLight('#d9a8ff',85,430,2); warm.position.set(0,65,0); scene.add(warm);
  const world = {w:1800,h:1250}; const maps = {enemies:new Map(), objects:new Map(), particles:[]};
  let activeZone = '', terrain, scenery = new THREE.Group(), player, playerAura, slashRing, lastWidth=0,lastHeight=0, frame=0;
  scene.add(scenery);
  const mat=(color,roughness=.8,metalness=.05,emissive=null,intensity=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness,emissive:emissive||color,emissiveIntensity:intensity});
  const mats={
    ground:mat('#182b30'), grass:mat('#29453f'), stone:mat('#30364a'), stone2:mat('#45445d'), gold:mat('#d7b66c',.35,.55,'#b78337',.6),
    violet:mat('#9279f4',.35,.15,'#7252ff',2.0), cyan:mat('#65e7e5',.3,.1,'#39d9ec',2.6), red:mat('#ed718d',.35,.1,'#ed315d',2),
    cloth:mat('#27243d'), armor:mat('#777b9d',.32,.55), skin:mat('#d4b99d'), dark:mat('#141827'), wood:mat('#493b38'), ghost:mat('#9f87ef',.25,.15,'#7255ff',2.4),
    cityGround:mat('#202037'), cityStone:mat('#36304e'), crystal:mat('#73dce3',.25,.15,'#39d9ec',2.8)
  };
  function v(x,y,z){return new THREE.Vector3(x,y,z)}
  function pos(x,y,h=0){return v(x-world.w/2,h,y-world.h/2)}
  function mesh(geo,material,parent=scene){const m=new THREE.Mesh(geo,material);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
  function box(parent,x,y,z,sx,sy,sz,material,rot=0){const m=mesh(new THREE.BoxGeometry(sx,sy,sz),material,parent);m.position.set(x,y,z);m.rotation.y=rot;return m}
  function sphere(parent,x,y,z,r,material,seg=12){const m=mesh(new THREE.IcosahedronGeometry(r,seg>12?1:0),material,parent);m.position.set(x,y,z);return m}
  function cylinder(parent,x,y,z,rt,rb,h,material,segments=8){const m=mesh(new THREE.CylinderGeometry(rt,rb,h,segments),material,parent);m.position.set(x,y,z);return m}
  function ring(parent,r,t,material){const m=mesh(new THREE.TorusGeometry(r,t,8,48),material,parent);m.rotation.x=Math.PI/2;return m}
  function labelSprite(text,color='#dce7ff'){
    const c=document.createElement('canvas');c.width=512;c.height=96;const g=c.getContext('2d');g.clearRect(0,0,512,96);g.font='bold 30px system-ui';g.textAlign='center';g.shadowColor='#050712';g.shadowBlur=10;g.fillStyle=color;g.fillText(text,256,56);
    const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));m.scale.set(95,18,1);return m;
  }
  function makePlayer(){
    const g=new THREE.Group();
    // cloak, layered armor, face, hood and luminous seam core
    const cloak=mesh(new THREE.ConeGeometry(13,35,7),mats.cloth,g);cloak.position.y=20;cloak.rotation.x=Math.PI;
    cylinder(g,0,25,0,9,11,16,mats.armor,8);
    box(g,-10,28,0,7,9,9,mats.armor,-.16);box(g,10,28,0,7,9,9,mats.armor,.16);
    sphere(g,0,42,0,7,mats.skin,12);const hood=mesh(new THREE.SphereGeometry(8,10,8,0,Math.PI*2,0,Math.PI*.72),mats.dark,g);hood.position.y=44;
    const visor=box(g,0,42,6,7,2,1,mats.gold);visor.material=mats.cyan;
    cylinder(g,-5,8,0,3.8,4.5,16,mats.dark,7).position.z=0;
    cylinder(g,5,8,0,3.8,4.5,16,mats.dark,7);
    const sword=box(g,15,25,0,2,28,3,mats.gold,.12);sword.position.x=13;sword.position.z=1;
    const blade=mesh(new THREE.ConeGeometry(2.5,10,4),mats.cyan,g);blade.position.set(13,44,1);blade.rotation.z=Math.PI;
    playerAura=ring(g,16,1.1,mats.violet);playerAura.position.y=2;
    slashRing=ring(g,28,.9,mats.cyan);slashRing.position.y=13;slashRing.visible=false;
    g.userData.sword=sword;g.userData.blade=blade;g.userData.visor=visor;g.userData.cloak=cloak;
    return g;
  }
  player=makePlayer();scene.add(player);
  function makeWisp(e){
    const g=new THREE.Group();const boss=e.type==='boss';const city=e.type==='wraith';
    const core=sphere(g,0,boss?30:18,0,boss?18:10,boss?mats.red:(city?mats.crystal:mats.ghost),12);
    if(boss){for(let i=0;i<5;i++){const spike=mesh(new THREE.ConeGeometry(5,20,5),mats.red,g);const a=i/5*Math.PI*2;spike.position.set(Math.cos(a)*13,38,Math.sin(a)*13);spike.rotation.z=-Math.cos(a)*.7;spike.rotation.x=Math.sin(a)*.7;}
      const halo=ring(g,27,1.5,mats.violet);halo.position.y=40;g.userData.halo=halo;
      for(let i=0;i<3;i++){const orb=sphere(g,Math.cos(i*2.09)*23,20+Math.sin(i*2.09)*7,Math.sin(i*2.09)*23,4,mats.gold);g.userData.orbs=(g.userData.orbs||[]).concat(orb)}
    } else {
      const a=mesh(new THREE.ConeGeometry(6,14,5),mats.dark,g);a.position.set(-5,8,0);a.rotation.z=.45;
      const b=mesh(new THREE.ConeGeometry(6,14,5),mats.dark,g);b.position.set(5,8,0);b.rotation.z=-.45;
      sphere(g,-3,boss?32:20,8,1.5,mats.gold);sphere(g,3,boss?32:20,8,1.5,mats.gold);
      const aura=ring(g,boss?25:15,1,boss?mats.red:mats.violet);aura.position.y=2;g.userData.aura=aura;
    }
    const lbl=labelSprite(e.name,boss?'#ffb2cf':'#d9d0ff');lbl.position.y=boss?63:42;g.add(lbl);g.userData.core=core;return g;
  }
  function makeObject(o){
    const g=new THREE.Group();const type=o.type;
    if(type==='npc'){
      cylinder(g,0,13,0,7,10,24,mats.cloth,7);sphere(g,0,30,0,7,mats.skin);const hood=mesh(new THREE.ConeGeometry(9,15,7),mats.violet,g);hood.position.y=35;hood.rotation.x=.08;
      const staff=cylinder(g,10,19,0,1.2,1.8,36,mats.gold,6);staff.rotation.z=-.12;sphere(g,10,38,0,3.5,mats.cyan);
    } else if(type==='gate'||type==='cityGate'){
      const gateMat=type==='cityGate'?mats.crystal:mats.violet;
      box(g,-21,31,0,7,62,9,mats.stone2);box(g,21,31,0,7,62,9,mats.stone2);box(g,0,62,0,50,7,9,mats.gold);
      const portal=mesh(new THREE.TorusGeometry(17,2.5,10,40),gateMat,g);portal.position.y=32;portal.scale.set(.8,1.45,.3);g.userData.portal=portal;
      const inner=mesh(new THREE.CircleGeometry(15,32),gateMat,g);inner.position.set(0,32,-1);inner.material=inner.material.clone();inner.material.side=THREE.DoubleSide;inner.material.transparent=true;inner.material.opacity=.22;g.userData.inner=inner;
    } else if(type==='chest'){
      box(g,0,8,0,26,15,18,mats.wood);box(g,0,16,0,27,5,19,mats.gold);box(g,0,10,9.5,4,8,1,mats.gold);
    } else {
      const shard=mesh(new THREE.OctahedronGeometry(11,0),type==='timeShard'?mats.crystal:mats.cyan,g);shard.position.y=22;g.userData.shard=shard;
      const aura=ring(g,18,1.1,type==='timeShard'?mats.gold:mats.cyan);aura.position.y=2;g.userData.aura=aura;
      const beam=mesh(new THREE.CylinderGeometry(.2,5,50,8,1,true),type==='timeShard'?mats.gold:mats.cyan,g);beam.position.y=27;beam.material=beam.material.clone();beam.material.transparent=true;beam.material.opacity=.12;beam.material.depthWrite=false;
    }
    const lbl=labelSprite(o.name,o.type==='npc'?'#e0d1ff':(o.type==='echo'||o.type==='timeShard')?'#a5ffff':'#f2d6a1');lbl.position.y=type==='gate'||type==='cityGate'?83:53;g.add(lbl);g.userData.label=lbl;return g;
  }
  function clearGroup(g){while(g.children.length){const c=g.children.pop();g.remove(c);if(c.geometry)c.geometry.dispose();}}
  function buildTerrain(zone){
    if(terrain){scene.remove(terrain);terrain.traverse(o=>{if(o.geometry)o.geometry.dispose()});}
    const city=zone==='forgotten-city';
    const groundMat=city?mats.cityGround:mats.ground;
    terrain=new THREE.Group();scene.add(terrain);
    const floor=mesh(new THREE.PlaneGeometry(world.w,world.h,1,1),groundMat,terrain);floor.rotation.x=-Math.PI/2;floor.position.set(0,-1,0);floor.receiveShadow=true;
    // Large broken flagstones, paths, fissures and low-poly scenery create a walkable, readable space.
    for(let z=-world.h/2+45;z<world.h/2;z+=82){for(let x=-world.w/2+45;x<world.w/2;x+=82){const seed=Math.sin(x*12.9898+z*78.233)*43758.5453;const n=seed-Math.floor(seed);if(n>.84)continue;const size=city?22+n*17:18+n*24;const tile=mesh(new THREE.BoxGeometry(size,.8,size*.72),city?(n>.6?mats.cityStone:mats.stone):(n>.65?mats.grass:mats.stone),terrain);tile.position.set(x,-.55,z);tile.rotation.y=n*1.4;tile.receiveShadow=true;tile.castShadow=false;}}
    const paths=city?[[0,0,0,150],[0,150,220,90],[220,90,480,0],[-100,-100,150,-220]]:[[0,70,0,-100],[-80,-100,-320,-180],[0,-100,280,-210],[0,70,240,290]];
    paths.forEach(([x1,z1,x2,z2])=>{const len=Math.hypot(x2-x1,z2-z1);const road=mesh(new THREE.BoxGeometry(35,1,len),city?mats.cityStone:mats.stone2,terrain);road.position.set((x1+x2)/2,-.05,(z1+z2)/2);road.rotation.y=-Math.atan2(z2-z1,x2-x1)+Math.PI/2;road.castShadow=false;});
    // Ancient pillars and fractured walls.
    const rng=(i)=>{const x=Math.sin(i*127.1+zone.length*19.7)*43758.5453;return x-Math.floor(x)};
    for(let i=0;i<40;i++){
      const x=(rng(i+1)-.5)*(world.w-130),z=(rng(i+80)-.5)*(world.h-130);
      if(Math.abs(x)<105&&Math.abs(z)<100)continue;
      const h=city?24+rng(i+150)*58:18+rng(i+150)*43;
      if(i%3===0){const pillar=cylinder(terrain,x,h/2,z,5+rng(i+3)*5,7+rng(i+3)*5,h,city?mats.cityStone:mats.stone2,6);pillar.rotation.z=(rng(i+4)-.5)*.15;}
      else {const b=box(terrain,x,3+rng(i+9)*3,z,18+rng(i+4)*36,5+rng(i+6)*10,12+rng(i+5)*26,city?mats.cityStone:mats.stone2,rng(i+7)*1.4);b.rotation.z=(rng(i+8)-.5)*.12;}
    }
    // Luminous crystals and alien flora.
    for(let i=0;i<30;i++){
      const x=(rng(i+300)-.5)*(world.w-90),z=(rng(i+340)-.5)*(world.h-90);if(Math.abs(x)<80&&Math.abs(z)<90)continue;
      if(i%2===0){const c=mesh(new THREE.ConeGeometry(7+rng(i+400)*6,24+rng(i+410)*28,5),city?mats.crystal:mats.violet,terrain);c.position.set(x,12,z);c.rotation.z=(rng(i+420)-.5)*.35;const light=new THREE.PointLight(city?'#64e3ef':'#9072ff',8,90,2);light.position.set(x,18,z);terrain.add(light);}
      else {cylinder(terrain,x,5,z,2,3,10,mats.dark,5);for(let j=0;j<3;j++){const leaf=mesh(new THREE.ConeGeometry(5,20,5),city?mats.crystal:mats.grass,terrain);leaf.position.set(x+(j-1)*5,14,z+(j%2)*4);leaf.rotation.z=(j-1)*.5;}}
    }
    // Zone-specific centerpiece, a broken observatory or a time-locked clock tower.
    const cx=city?0:world.w/2-190,cz=city?-20:0;
    if(city){for(let i=0;i<3;i++){const tower=cylinder(terrain,cx+(i-1)*55,38,cz+(i%2)*25,12,18,76,mats.cityStone,7);tower.rotation.z=(i-1)*.08;const cap=mesh(new THREE.ConeGeometry(19,26,7),mats.violet,terrain);cap.position.set(cx+(i-1)*55,89,cz+(i%2)*25);}}
    else {const obelisk=mesh(new THREE.OctahedronGeometry(44,0),mats.violet,terrain);obelisk.position.set(cx,48,cz);obelisk.scale.set(1,1.8,1);const halo=ring(terrain,67,2,mats.cyan);halo.position.set(cx,28,cz);halo.rotation.x=Math.PI/2;}
    const borderMat=city?mats.violet:mats.cyan;
    for(const [x,z,sx,sz] of [[0,-world.h/2,world.w,4],[0,world.h/2,world.w,4],[-world.w/2,0,4,world.h],[world.w/2,0,4,world.h]]){const edge=mesh(new THREE.BoxGeometry(sx,1,sz),borderMat,terrain);edge.position.set(x,-.2,z);edge.material=edge.material.clone();edge.material.transparent=true;edge.material.opacity=.22;edge.castShadow=false;}
    scene.background=new THREE.Color(city?'#141329':'#101a25');scene.fog.color.set(city?'#17132b':'#101a25');scene.fog.density=city?.00135:.00112;
    warm.color.set(city?'#6adce8':'#9a72ff');warm.position.set(city?0:cx,65,city?-20:cz);warm.intensity=city?115:85;
  }
  function ensureZone(zone){if(activeZone===zone)return;activeZone=zone;buildTerrain(zone);maps.enemies.forEach(m=>{scene.remove(m);});maps.objects.forEach(m=>scene.remove(m));maps.enemies.clear();maps.objects.clear();}
  function syncEntities(state){
    const enemyIds=new Set();for(const e of state.enemies||[]){if(!e.alive)continue;enemyIds.add(String(e.id));let g=maps.enemies.get(String(e.id));if(!g){g=makeWisp(e);maps.enemies.set(String(e.id),g);scene.add(g)}const p=pos(e.x,e.y,0);g.position.set(p.x,Math.sin((e.phase||0)*2.6)*2,p.z);g.rotation.y=(e.phase||0)*.3;if(g.userData.core){g.userData.core.scale.setScalar(e.type==='boss'?1+Math.sin(state.tick*4)*.09:1+Math.sin(state.tick*3)*.06);if(e.hit>0)g.userData.core.material=mats.gold;else g.userData.core.material=e.type==='boss'?mats.red:(e.type==='wraith'?mats.crystal:mats.ghost)}if(g.userData.halo)g.userData.halo.rotation.z=state.tick*.45;if(g.userData.aura)g.userData.aura.rotation.z=-state.tick*.7;if(g.userData.orbs)g.userData.orbs.forEach((o,i)=>{const a=state.tick*1.5+i*2.09;o.position.set(Math.cos(a)*23,20+Math.sin(a*1.4)*8,Math.sin(a)*23)});g.visible=true;g.userData.hp=e.hp/e.maxHp;}
    for(const [id,g] of maps.enemies){if(!enemyIds.has(id)){scene.remove(g);maps.enemies.delete(id)}}
    const objIds=new Set();for(const o of state.interactables||[]){objIds.add(String(o.id));let g=maps.objects.get(String(o.id));if(!g){g=makeObject(o);maps.objects.set(String(o.id),g);scene.add(g)}const p=pos(o.x,o.y,0);g.position.set(p.x,0,p.z);g.rotation.y=o.type==='npc'?Math.sin(state.tick*.4)*.08:0;g.visible=!(o.used&&o.type!=='npc');if(o.used&&o.type!=='npc')g.visible=false;if(g.userData.shard){g.userData.shard.rotation.y=state.tick*1.2;g.userData.shard.rotation.x=Math.sin(state.tick)*.2;g.userData.shard.position.y=22+Math.sin(state.tick*2+o.x)*3}if(g.userData.portal){g.userData.portal.rotation.y=state.tick*.25;g.userData.inner.material.opacity=.14+Math.sin(state.tick*2)*.07}if(g.userData.aura)g.userData.aura.rotation.z=state.tick*.5;}
    for(const [id,g] of maps.objects){if(!objIds.has(id)){scene.remove(g);maps.objects.delete(id)}}
  }
  function syncParticles(state,dt){
    const arr=state.particles||[];while(maps.particles.length<arr.length){const m=sphere(scene,0,-10000,0,1,mats.cyan,8);m.material=m.material.clone();maps.particles.push(m)}
    arr.forEach((p,i)=>{const m=maps.particles[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(.08,dt);p.vy*=Math.pow(.08,dt);p.t-=dt;const q=pos(p.x,p.y,8+Math.max(0,p.r||2));m.position.set(q.x,q.y,q.z);m.scale.setScalar(Math.max(.01,(p.r||2)*Math.min(1,p.t/(p.max||.5))));m.material.color.set(p.color||'#79d8db');m.material.emissive.set(p.color||'#79d8db');m.material.emissiveIntensity=2.2;m.visible=p.t>0;});
    state.particles=arr.filter(p=>p.t>0);for(let i=state.particles.length;i<maps.particles.length;i++)maps.particles[i].visible=false;
    const floats=state.floats||[];floats.forEach(f=>{f.y-=22*dt;f.t-=dt});state.floats=floats.filter(f=>f.t>0);
  }
  function render(state,dt){
    const w=Math.max(1,wrap.clientWidth),h=Math.max(1,wrap.clientHeight);
    if(w!==lastWidth||h!==lastHeight){lastWidth=w;lastHeight=h;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
    ensureZone(state.activeZone||'shiverwild');syncEntities(state);syncParticles(state,dt);
    const p=state.player||{x:900,y:700,faceX:1,faceY:0};const pp=pos(p.x,p.y,0);player.position.set(pp.x,0,pp.z);player.rotation.y=Math.atan2(p.faceX,p.faceY);
    playerAura.material=state.className==='Dawnbreaker'?mats.gold:state.className==='Hollowkeeper'?mats.crystal:mats.violet;
    playerAura.rotation.z=state.tick*.9;playerAura.scale.setScalar(1+Math.sin(state.tick*3)*.08);
    player.userData.cloak.scale.y=1+Math.sin(state.tick*5)*.035;
    player.userData.visor.material=state.className==='Dawnbreaker'?mats.gold:state.className==='Paradoxist'?mats.crystal:state.className==='Hollowkeeper'?mats.ghost:mats.cyan;
    player.visible=!(p.invuln>0&&Math.floor(state.tick*20)%2===0);
    slashRing.visible=(p.slash||0)>0;slashRing.rotation.z=state.tick*2;slashRing.material=state.className==='Dawnbreaker'?mats.gold:mats.cyan;slashRing.scale.setScalar(1+Math.max(0,p.slash||0)*1.8);
    const forward=pos(p.x+(p.faceX||0)*95,p.y+(p.faceY||0)*95,0);
    const camY=state.activeZone==='forgotten-city'?330:300;const desired=v(pp.x-(p.faceX||0)*65,camY,pp.z+360-(p.faceY||0)*75);
    camera.position.lerp(desired,.085);camera.lookAt(v(pp.x+(p.faceX||0)*25,14,pp.z+(p.faceY||0)*25));
    // Light follow gives the hero a readable focal glow without flattening the night palette.
    warm.position.set(pp.x+35,62,pp.z-15);frame++;renderer.render(scene,camera);
  }
  window.Echoes3D={render,renderer,scene,version:'0.5.0'};
})();
