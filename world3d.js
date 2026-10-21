/* Echoes of the Unwritten — 3D world renderer, build 0.7.0 with skinned GLB art pipeline
   Three.js is loaded from jsDelivr by index.html. Authored GLB character, enemy and modular environment assets are preferred; emergency primitive fallbacks preserve playability offline. */
(() => {
  'use strict';
  const THREE = window.THREE;
  if (!THREE) { const fallback=document.getElementById('gameCanvas'); if(fallback) fallback.style.opacity='1'; console.error('Three.js failed to load; using the 2D fallback.'); return; }
  const wrap = document.querySelector('.canvas-wrap');
  const oldCanvas = document.getElementById('gameCanvas');
  const canvas = document.createElement('canvas');
  canvas.id = 'world3dCanvas'; canvas.setAttribute('aria-label','Three-dimensional world of Echoes of the Unwritten');
  wrap.insertBefore(canvas, oldCanvas.nextSibling);
  const mobileQuality = window.matchMedia('(max-width: 720px)').matches || /iPhone|iPad|Android/i.test(navigator.userAgent);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({canvas, antialias:!mobileQuality, alpha:false, powerPreference:'high-performance'}); }
  catch (err) { oldCanvas.style.opacity='1'; canvas.remove(); console.error('WebGL unavailable; using the 2D fallback.',err); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobileQuality ? 1.1 : 1.6));
  renderer.setSize(Math.max(1,wrap.clientWidth), Math.max(1,wrap.clientHeight), false);
  renderer.shadowMap.enabled = !mobileQuality; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#111827'); scene.fog = new THREE.FogExp2('#111827', .00112);
  const camera = new THREE.PerspectiveCamera(49, Math.max(1,wrap.clientWidth)/Math.max(1,wrap.clientHeight), .1, 2600);
  const hemi = new THREE.HemisphereLight('#9aa9ff','#101722',2.0); scene.add(hemi);
  const moon = new THREE.DirectionalLight('#c4ccff',3.0); moon.position.set(-280,500,-160); moon.castShadow=true; moon.shadow.mapSize.set(mobileQuality?512:1024,mobileQuality?512:1024); moon.shadow.camera.left=-430; moon.shadow.camera.right=430; moon.shadow.camera.top=430; moon.shadow.camera.bottom=-430; scene.add(moon);
  const warm = new THREE.PointLight('#d9a8ff',85,430,2); warm.position.set(0,65,0); scene.add(warm);
  const world = {w:1800,h:1250}; const maps = {enemies:new Map(), objects:new Map(), particles:[]};
  let activeZone = '', terrain, scenery = new THREE.Group(), player, playerAura, slashRing, lastWidth=0,lastHeight=0, frame=0;
  scene.add(scenery);
  const mat=(color,roughness=.8,metalness=.05,emissive=null,intensity=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness,emissive:emissive||color,emissiveIntensity:intensity});
  const mats={
    ground:mat('#182b30'), grass:mat('#29453f'), stone:mat('#30364a'), stone2:mat('#45445d'), gold:mat('#d7b66c',.35,.55,'#b78337',.6),
    violet:mat('#9279f4',.35,.15,'#7252ff',2.0), cyan:mat('#65e7e5',.3,.1,'#39d9ec',2.6), red:mat('#ed718d',.35,.1,'#ed315d',2),
    cloth:mat('#27243d'), armor:mat('#777b9d',.32,.55), skin:mat('#d4b99d'), dark:mat('#141827'), ink:mat('#17121f',.42,.2,'#351626',.55), rose:mat('#ff6e96',.3,.15,'#e52b69',2.8), wood:mat('#493b38'), ghost:mat('#9f87ef',.25,.15,'#7255ff',2.4),
    cityGround:mat('#202037'), cityStone:mat('#36304e'), archiveGround:mat('#1c101a'), archiveStone:mat('#453044',.72,.12,'#57203d',.4), crystal:mat('#73dce3',.25,.15,'#39d9ec',2.8)
  };
  // Asset-first pipeline: the authored GLB models and modular kit are loaded once and reused.
  // Procedural meshes remain only as an offline/CDN failure fallback, never as the preferred art path.
  const assetState={loader:null,enemyTemplate:null,enemyTemplates:new Map(),modules:null,loaded:false};
  function beginAssetLoads(){
    const Loader=window.EchoesGLTFLoader;if(!Loader)return;
    const loader=new Loader();assetState.loader=loader;
    const enemyAssets=[['margin','assets/enemies/margin_wraith_design.glb'],['stalker','assets/enemies/ink_stalker.glb'],['sentinel','assets/enemies/clockbound_sentinel.glb']];
    enemyAssets.forEach(([key,url])=>loader.load(url,gltf=>{
      const template=gltf.scene;template.name='Authored_'+key+'_Template';
      template.traverse(o=>{if(o.isMesh){o.castShadow=!mobileQuality;o.receiveShadow=!mobileQuality;if(o.material){o.material=o.material.clone();o.material.side=THREE.DoubleSide;}}});
      assetState.enemyTemplates.set(key,template);if(key==='margin')assetState.enemyTemplate=template;
      maps.enemies.forEach(m=>scene.remove(m));maps.enemies.clear();
    },undefined,e=>console.warn('Enemy GLB unavailable: '+url,e)));
    loader.load('assets/environment/modular_ruins_kit.glb',gltf=>{
      assetState.modules=new Map();gltf.scene.traverse(o=>{if(o.isMesh&&o.name){assetState.modules.set(o.name.replace(/_mesh$/,''),o);}});assetState.loaded=true;
      if(activeZone)buildTerrain(activeZone);
    },undefined,e=>console.warn('Modular environment GLB unavailable; fallback environment remains active.',e));
  }
  if(window.EchoesGLTFLoader)beginAssetLoads();else window.addEventListener('echoes-gltf-loader-ready',beginAssetLoads,{once:true});
  function cloneModule(name,parent,x,y,z,scale=1,rotation=0){const src=assetState.modules?.get(name);if(!src)return null;const obj=src.clone(true);obj.position.set(x,y,z);obj.scale.setScalar(scale);obj.rotation.y=rotation;obj.traverse(o=>{if(o.isMesh){if(Array.isArray(o.material))o.material=o.material.map(m=>m.clone());else if(o.material)o.material=o.material.clone();o.castShadow=!mobileQuality;o.receiveShadow=!mobileQuality;}});parent.add(obj);return obj;}
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
    const legL=new THREE.Group();legL.position.set(-5,16,0);g.add(legL);cylinder(legL,0,-7,0,3.8,4.5,14,mats.dark,7);box(legL,0,-15,2,7,3,11,mats.armor);
    const legR=new THREE.Group();legR.position.set(5,16,0);g.add(legR);cylinder(legR,0,-7,0,3.8,4.5,14,mats.dark,7);box(legR,0,-15,2,7,3,11,mats.armor);
    const armL=new THREE.Group();armL.position.set(-11,29,0);g.add(armL);cylinder(armL,0,-6,0,3.4,4,12,mats.armor,7);sphere(armL,0,-13,0,3,mats.skin,8);
    const armR=new THREE.Group();armR.position.set(11,29,0);g.add(armR);cylinder(armR,0,-6,0,3.4,4,12,mats.armor,7);sphere(armR,0,-13,0,3,mats.skin,8);
    g.userData.limbs={legL,legR,armL,armR};
    const sword=box(g,15,25,0,2,28,3,mats.gold,.12);sword.position.x=13;sword.position.z=1;
    const blade=mesh(new THREE.ConeGeometry(2.5,10,4),mats.cyan,g);blade.position.set(13,44,1);blade.rotation.z=Math.PI;
    g.userData.proceduralBody=g.children.slice();
    playerAura=ring(g,16,1.1,mats.violet);playerAura.position.y=2;
    slashRing=ring(g,28,.9,mats.cyan);slashRing.position.y=13;slashRing.visible=false;
    g.userData.sword=sword;g.userData.blade=blade;g.userData.visor=visor;g.userData.cloak=cloak;
    return g;
  }
  player=makePlayer();scene.add(player);
  // Load the authored, skinned GLB character when GLTFLoader is available. The
  // procedural character remains as a resilient fallback if the asset/CDN fails.
  let heroMixer=null, heroActions={}, heroActionName='';
  function playHeroAction(name,fade=.16){
    if(!heroMixer||!heroActions[name]||heroActionName===name)return;
    const next=heroActions[name]; next.reset().play();
    if(heroActionName&&heroActions[heroActionName])heroActions[heroActionName].crossFadeTo(next,fade,false);
    heroActionName=name;
  }
  function loadAuthoredHero(){
    const Loader=window.EchoesGLTFLoader; if(!Loader||player.userData.authoredRig||player.userData.authoredRigLoading)return;
    player.userData.authoredRigLoading=true;
    try{
      const loader=new Loader();
      loader.load('assets/characters/unwritten_hero.glb',gltf=>{
        const model=gltf.scene; model.name='AuthoredUnwrittenHero'; model.scale.setScalar(1.0); model.position.set(0,0,0);
        player.add(model); (player.userData.proceduralBody||[]).forEach(part=>{part.visible=false;});
        heroMixer=new THREE.AnimationMixer(model);
        gltf.animations.forEach(clip=>{heroActions[clip.name]=heroMixer.clipAction(clip);});
        playHeroAction('Idle',0); player.userData.authoredRig=true; player.userData.authoredRigLoading=false;
      },undefined,error=>{player.userData.authoredRigLoading=false;console.warn('Authored hero GLB could not load; procedural character remains active.',error);});
    }catch(error){player.userData.authoredRigLoading=false;console.warn('GLB pipeline unavailable; using procedural hero.',error);}
  }
  if(window.EchoesGLTFLoader)loadAuthoredHero();else window.addEventListener('echoes-gltf-loader-ready',loadAuthoredHero,{once:true});

  function makeWisp(e){
    const kind=(e.type==='wraith'||e.type==='redaction')?'stalker':(e.type==='elite'||e.type==='boss')?'sentinel':'margin';
    const template=assetState.enemyTemplates.get(kind)||assetState.enemyTemplate;
    if(template){
      const authored=new THREE.Group();const model=template.clone(true);const boss=e.type==='boss'||e.type==='authorBoss';const author=e.type==='authorBoss';
      model.name='Authored_'+String(e.type||'enemy');const baseScale=author?1.7:boss?1.25:(e.type==='elite'?0.9:kind==='stalker'?.68:.72);model.scale.setScalar(baseScale);
      const joints=[];const detailMeshes=[];model.traverse(o=>{if(/Arm_|BladeArm|Leg_|Quill|Crest|Pauldron|Rune_/i.test(o.name))joints.push(o);if(/Quill|Rune_|Crest|Pauldron/i.test(o.name))detailMeshes.push(o);if(o.isMesh){o.castShadow=!mobileQuality;o.receiveShadow=!mobileQuality;if(o.material){o.material=o.material.clone();if(author||e.type==='redaction'){o.material.emissive=new THREE.Color('#e52b69');o.material.emissiveIntensity=1.65;}else if(kind==='stalker'||e.type==='wraith'){o.material.emissive=new THREE.Color('#39d9ec');o.material.emissiveIntensity=1.1;}else if(kind==='sentinel'){o.material.emissive=new THREE.Color('#d6a54f');o.material.emissiveIntensity=.75;}}}});
      authored.userData.joints=joints;authored.userData.detailMeshes=detailMeshes;authored.userData.enemyKind=kind;authored.add(model);
      const aura=ring(authored,author?38:boss?27:16,author?2.1:1.1,author?mats.rose:(kind==='stalker'?mats.crystal:kind==='sentinel'?mats.gold:mats.violet));aura.position.y=2;authored.userData.aura=aura;
      if(boss){const telegraph=ring(authored,author?105:72,author?2.5:1.7,author?mats.rose:mats.red);telegraph.position.y=1;telegraph.visible=false;authored.userData.telegraph=telegraph;const halo=ring(authored,author?43:29,1.8,author?mats.rose:mats.violet);halo.position.y=52;authored.userData.halo=halo;}
      const lbl=labelSprite(e.name,author?'#ff91ad':boss?'#ffb2cf':'#d9d0ff');lbl.position.y=author?90:boss?72:46;authored.add(lbl);authored.userData.authoredAsset=true;return authored;
    }
    const g=new THREE.Group();const boss=e.type==='boss'||e.type==='authorBoss';const author=e.type==='authorBoss';const city=e.type==='wraith';
    const core=sphere(g,0,boss?(author?38:30):18,0,boss?(author?23:18):10,boss?(author?mats.rose:mats.red):(city?mats.crystal:mats.ghost),12);
    if(author){const mantle=mesh(new THREE.ConeGeometry(31,58,8),mats.ink,g);mantle.position.y=22;mantle.rotation.x=Math.PI;for(let i=0;i<8;i++){const quill=mesh(new THREE.ConeGeometry(4,34,5),mats.rose,g);const a=i*Math.PI/4;quill.position.set(Math.cos(a)*21,45+Math.sin(i*1.7)*8,Math.sin(a)*21);quill.rotation.z=-Math.cos(a)*.75;quill.rotation.x=Math.sin(a)*.75;}for(let i=0;i<4;i++){const page=box(g,Math.cos(i*1.57)*34,25+Math.sin(i)*8,Math.sin(i*1.57)*34,13,19,2,mats.gold,i*.5);page.material=page.material.clone();page.material.emissive.set('#ff7898');page.material.emissiveIntensity=1.2;}}
    if(boss){for(let i=0;i<(author?8:5);i++){const spike=mesh(new THREE.ConeGeometry(5,20,5),mats.red,g);const a=i/5*Math.PI*2;spike.position.set(Math.cos(a)*13,38,Math.sin(a)*13);spike.rotation.z=-Math.cos(a)*.7;spike.rotation.x=Math.sin(a)*.7;}
      const halo=ring(g,author?39:27,author?2:1.5,author?mats.rose:mats.violet);halo.position.y=author?52:40;g.userData.halo=halo;const telegraph=ring(g,author?105:72,author?2.5:1.7,author?mats.rose:mats.red);telegraph.position.y=1;telegraph.visible=false;g.userData.telegraph=telegraph;
      for(let i=0;i<(author?5:3);i++){const orb=sphere(g,Math.cos(i*(Math.PI*2/(author?5:3)))* (author?43:23),20+Math.sin(i*2.09)*7,Math.sin(i*(Math.PI*2/(author?5:3)))* (author?43:23),author?5:4,mats.gold);g.userData.orbs=(g.userData.orbs||[]).concat(orb)}
    } else {
      const a=mesh(new THREE.ConeGeometry(6,14,5),mats.dark,g);a.position.set(-5,8,0);a.rotation.z=.45;
      const b=mesh(new THREE.ConeGeometry(6,14,5),mats.dark,g);b.position.set(5,8,0);b.rotation.z=-.45;
      sphere(g,-3,boss?32:20,8,1.5,mats.gold);sphere(g,3,boss?32:20,8,1.5,mats.gold);
      const aura=ring(g,boss?25:15,1,boss?mats.red:mats.violet);aura.position.y=2;g.userData.aura=aura;
    }
    const lbl=labelSprite(e.name,author?'#ff91ad':boss?'#ffb2cf':'#d9d0ff');lbl.position.y=boss?63:42;g.add(lbl);g.userData.core=core;return g;
  }
  function makeObject(o){
    const g=new THREE.Group();const type=o.type;
    if(type==='npc'){
      cylinder(g,0,13,0,7,10,24,mats.cloth,7);sphere(g,0,30,0,7,mats.skin);const hood=mesh(new THREE.ConeGeometry(9,15,7),mats.violet,g);hood.position.y=35;hood.rotation.x=.08;
      const staff=cylinder(g,10,19,0,1.2,1.8,36,mats.gold,6);staff.rotation.z=-.12;sphere(g,10,38,0,3.5,mats.cyan);
    } else if(type==='gate'||type==='cityGate'||type==='authorGate'){
      const gateMat=type==='authorGate'?mats.rose:type==='cityGate'?mats.crystal:mats.violet;
      box(g,-21,31,0,7,62,9,mats.stone2);box(g,21,31,0,7,62,9,mats.stone2);box(g,0,62,0,50,7,9,mats.gold);
      const portal=mesh(new THREE.TorusGeometry(17,2.5,10,40),gateMat,g);portal.position.y=32;portal.scale.set(.8,1.45,.3);g.userData.portal=portal;
      const inner=mesh(new THREE.CircleGeometry(15,32),gateMat,g);inner.position.set(0,32,-1);inner.material=inner.material.clone();inner.material.side=THREE.DoubleSide;inner.material.transparent=true;inner.material.opacity=.22;g.userData.inner=inner;
    } else if(type==='chest'){
      box(g,0,8,0,26,15,18,mats.wood);box(g,0,16,0,27,5,19,mats.gold);box(g,0,10,9.5,4,8,1,mats.gold);
    } else {
      const shard=mesh(new THREE.OctahedronGeometry(type==='authorSigil'?13:11,0),type==='authorSigil'?mats.rose:type==='timeShard'?mats.crystal:mats.cyan,g);shard.position.y=22;g.userData.shard=shard;
      const aura=ring(g,type==='authorSigil'?22:18,1.1,type==='authorSigil'?mats.rose:type==='timeShard'?mats.gold:mats.cyan);aura.position.y=2;g.userData.aura=aura;
      const beam=mesh(new THREE.CylinderGeometry(.2,5,50,8,1,true),type==='timeShard'?mats.gold:mats.cyan,g);beam.position.y=27;beam.material=beam.material.clone();beam.material.transparent=true;beam.material.opacity=.12;beam.material.depthWrite=false;
    }
    const lbl=labelSprite(o.name,o.type==='npc'?'#e0d1ff':(o.type==='echo'||o.type==='timeShard'||o.type==='authorSigil')?'#a5ffff':'#f2d6a1');lbl.position.y=type==='gate'||type==='cityGate'||type==='authorGate'?83:53;g.add(lbl);g.userData.label=lbl;return g;
  }
  function clearGroup(g){while(g.children.length){const c=g.children.pop();g.remove(c);if(c.geometry)c.geometry.dispose();}}
  function buildTerrain(zone){
    if(terrain){scene.remove(terrain);terrain.traverse(o=>{if(o.geometry)o.geometry.dispose()});}
    const city=zone==='forgotten-city';const archive=zone==='author-archive';
    const groundMat=archive?mats.archiveGround:city?mats.cityGround:mats.ground;
    terrain=new THREE.Group();scene.add(terrain);
    const floor=mesh(new THREE.PlaneGeometry(world.w,world.h,1,1),groundMat,terrain);floor.rotation.x=-Math.PI/2;floor.position.set(0,-1,0);floor.receiveShadow=true;
    // Large broken flagstones, paths, fissures and low-poly scenery create a walkable, readable space.
    for(let z=-world.h/2+45;z<world.h/2;z+=82){for(let x=-world.w/2+45;x<world.w/2;x+=82){const seed=Math.sin(x*12.9898+z*78.233)*43758.5453;const n=seed-Math.floor(seed);if(n>.84)continue;const size=city?22+n*17:18+n*24;if(assetState.modules){cloneModule('Archive_Floor_Tile',terrain,x,-.55,z,.62+n*.24,n*1.4);}else{const tile=mesh(new THREE.BoxGeometry(size,.8,size*.72),archive?(n>.55?mats.archiveStone:mats.ink):city?(n>.6?mats.cityStone:mats.stone):(n>.65?mats.grass:mats.stone),terrain);tile.position.set(x,-.55,z);tile.rotation.y=n*1.4;tile.receiveShadow=true;tile.castShadow=false;}}}
    const paths=city?[[0,0,0,150],[0,150,220,90],[220,90,480,0],[-100,-100,150,-220]]:[[0,70,0,-100],[-80,-100,-320,-180],[0,-100,280,-210],[0,70,240,290]];
    paths.forEach(([x1,z1,x2,z2])=>{const len=Math.hypot(x2-x1,z2-z1);const road=mesh(new THREE.BoxGeometry(35,1,len),city?mats.cityStone:mats.stone2,terrain);road.position.set((x1+x2)/2,-.05,(z1+z2)/2);road.rotation.y=-Math.atan2(z2-z1,x2-x1)+Math.PI/2;road.castShadow=false;});
    // Modular authored architecture replaces the old scattered primitive clutter.
    const rng=(i)=>{const x=Math.sin(i*127.1+zone.length*19.7)*43758.5453;return x-Math.floor(x)};
    if(assetState.modules){
      for(let i=0;i<14;i++){const x=(rng(i+1)-.5)*(world.w-180),z=(rng(i+80)-.5)*(world.h-180);if(Math.abs(x)<125&&Math.abs(z)<125)continue;
        const scale=city?1.55:archive?1.65:1.35;const moduleName=i%5===0?'Fractured_Arch_Left':i%5===1?'Fractured_Arch_Right':i%5===2?'Pillar_Shaft':'Pillar_Capital';
        cloneModule(moduleName,terrain,x,0,z,scale,rng(i+7)*Math.PI*2);
      }
      for(let i=0;i<18;i++){const x=(rng(i+300)-.5)*(world.w-110),z=(rng(i+340)-.5)*(world.h-110);if(Math.abs(x)<90&&Math.abs(z)<100)continue;cloneModule('Cyan_Crystal_Cluster_Core',terrain,x,0,z,city?.9:archive?.82:1.0,rng(i+420)*Math.PI*2);}
      cloneModule('Rift_Gate_Frame',terrain,world.w/2-150,0,0,1.8,Math.PI/2);
      cloneModule('Fractured_Arch_Lintel',terrain,0,0,-world.h/2+90,1.6,0);
    } else {
      // Offline fallback for environments where the GLTF loader or asset request fails.
      for(let i=0;i<24;i++){const x=(rng(i+1)-.5)*(world.w-130),z=(rng(i+80)-.5)*(world.h-130);if(Math.abs(x)<105&&Math.abs(z)<100)continue;const h=city?24+rng(i+150)*58:18+rng(i+150)*43;const pillar=cylinder(terrain,x,h/2,z,5+rng(i+3)*5,7+rng(i+3)*5,h,city?mats.cityStone:mats.stone2,6);pillar.rotation.z=(rng(i+4)-.5)*.15;}
      for(let i=0;i<14;i++){const x=(rng(i+300)-.5)*(world.w-90),z=(rng(i+340)-.5)*(world.h-90);const c=mesh(new THREE.ConeGeometry(7+rng(i+400)*6,24+rng(i+410)*28,5),city?mats.crystal:mats.violet,terrain);c.position.set(x,12,z);}
    }
    // Zone-specific centerpiece, a broken observatory or a time-locked clock tower.
    const cx=city?0:world.w/2-190,cz=city?-20:0;
    if(archive){if(assetState.modules){for(let i=0;i<7;i++){const x=-world.w/2+140+i*245;cloneModule(i%2?'Fractured_Arch_Left':'Pillar_Shaft',terrain,x,0,-150+(i%2)*85,1.9+(i%3)*.15,i%2?.08:-.05);cloneModule('Pillar_Capital',terrain,x,70,-150+(i%2)*85,1.7,0);cloneModule('Rift_Gate_Frame',terrain,x,0,-150+(i%2)*85,1.1,0);}for(let i=0;i<18;i++)cloneModule('Cyan_Crystal_Cluster_Core',terrain,-world.w/2+Math.abs(Math.sin(i*7.13))*world.w,8+(i%5)*7,-world.h/2+Math.abs(Math.cos(i*3.7))*world.h,.6+(i%4)*.1,i*1.3);}else{for(let i=0;i<7;i++){const x=-world.w/2+140+i*245;const tower=cylinder(terrain,x,45,-150+(i%2)*85,13,20,90+(i%3)*22,mats.archiveStone,7);tower.rotation.z=(i%2?.06:-.05);const crown=mesh(new THREE.ConeGeometry(22,32,6),mats.ink,terrain);crown.position.set(x,105+(i%3)*22,-150+(i%2)*85);const glyph=ring(terrain,26,1.4,mats.rose);glyph.position.set(x,52,-150+(i%2)*85);glyph.rotation.x=Math.PI/2;}for(let i=0;i<18;i++){const shard=mesh(new THREE.OctahedronGeometry(5+(i%4)*2,0),i%2?mats.rose:mats.gold,terrain);shard.position.set(-world.w/2+Math.abs(Math.sin(i*7.13))*world.w,8+(i%5)*7,-world.h/2+Math.abs(Math.cos(i*3.7))*world.h);shard.rotation.set(i*.7,i*1.3,i*.4);}}}
    if(city){for(let i=0;i<3;i++){const tower=cylinder(terrain,cx+(i-1)*55,38,cz+(i%2)*25,12,18,76,mats.cityStone,7);tower.rotation.z=(i-1)*.08;const cap=mesh(new THREE.ConeGeometry(19,26,7),mats.violet,terrain);cap.position.set(cx+(i-1)*55,89,cz+(i%2)*25);}}
    else {const obelisk=mesh(new THREE.OctahedronGeometry(44,0),mats.violet,terrain);obelisk.position.set(cx,48,cz);obelisk.scale.set(1,1.8,1);const halo=ring(terrain,67,2,mats.cyan);halo.position.set(cx,28,cz);halo.rotation.x=Math.PI/2;}
    const borderMat=city?mats.violet:mats.cyan;
    for(const [x,z,sx,sz] of [[0,-world.h/2,world.w,4],[0,world.h/2,world.w,4],[-world.w/2,0,4,world.h],[world.w/2,0,4,world.h]]){const edge=mesh(new THREE.BoxGeometry(sx,1,sz),borderMat,terrain);edge.position.set(x,-.2,z);edge.material=edge.material.clone();edge.material.transparent=true;edge.material.opacity=.22;edge.castShadow=false;}
    scene.background=new THREE.Color(archive?'#1c101a':city?'#141329':'#101a25');scene.fog.color.set(archive?'#2a1422':city?'#17132b':'#101a25');scene.fog.density=archive?.0015:city?.00135:.00112;
    warm.color.set(archive?'#ff537f':city?'#6adce8':'#9a72ff');warm.position.set(city?0:cx,65,city?-20:cz);warm.intensity=archive?145:city?115:85;
  }
  function ensureZone(zone){if(activeZone===zone)return;activeZone=zone;try{buildTerrain(zone)}catch(err){console.error('Zone renderer recovered from a terrain build error:',err);activeZone='';throw err;}maps.enemies.forEach(m=>{scene.remove(m);});maps.objects.forEach(m=>scene.remove(m));maps.enemies.clear();maps.objects.clear();}
  function syncEntities(state){
    const enemyIds=new Set();for(const e of state.enemies||[]){if(!e.alive)continue;enemyIds.add(String(e.id));let g=maps.enemies.get(String(e.id));if(!g){g=makeWisp(e);maps.enemies.set(String(e.id),g);scene.add(g)}const p=pos(e.x,e.y,0);g.position.set(p.x,Math.sin((e.phase||0)*2.6)*2,p.z);g.rotation.y=(e.phase||0)*.3;if(g.userData.authoredAsset){g.rotation.z=Math.sin(state.tick*1.8+(e.phase||0))*(e.type==='authorBoss'?.07:.035);const base=e.type==='authorBoss'?1.7:e.type==='boss'?1.25:e.type==='elite'?.9:g.userData.enemyKind==='stalker'?.68:.72;g.scale.setScalar(base*(1+Math.sin(state.tick*3+(e.phase||0))*.018));(g.userData.joints||[]).forEach((q,i)=>{const wave=state.tick*(g.userData.enemyKind==='sentinel'?2.0:2.8)+i*.91+(e.phase||0);q.rotation.z=Math.sin(wave)*(/Arm|Quill|BladeArm/i.test(q.name)?.26:.13);q.rotation.x=Math.cos(wave*.73)*.18;});const dist=Math.hypot((state.player?.x||0)-e.x,(state.player?.y||0)-e.y);(g.userData.detailMeshes||[]).forEach(o=>{o.visible=!mobileQuality||dist<470;});}if(g.userData.core){g.userData.core.scale.setScalar(e.type==='boss'?1+Math.sin(state.tick*4)*.09:1+Math.sin(state.tick*3)*.06);if(e.hit>0)g.userData.core.material=mats.gold;else g.userData.core.material=e.type==='authorBoss'?mats.rose:e.type==='boss'?mats.red:(e.type==='wraith'?mats.crystal:e.type==='redaction'?mats.rose:mats.ghost)}if(g.userData.halo)g.userData.halo.rotation.z=state.tick*.45;if(g.userData.telegraph){g.userData.telegraph.position.set((e.warningX??e.x)-e.x,1,(e.warningY??e.y)-e.y);g.userData.telegraph.visible=!!(e.warning&&e.warning>0);g.userData.telegraph.scale.setScalar(.6+.4*Math.sin(state.tick*10));g.userData.telegraph.material.opacity=e.warning?Math.min(1,.25+e.warning):.7;g.userData.telegraph.material.transparent=true;}if(g.userData.aura)g.userData.aura.rotation.z=-state.tick*.7;if(g.userData.orbs)g.userData.orbs.forEach((o,i)=>{const n=g.userData.orbs.length,a=state.tick*(e.type==='authorBoss'?1.0:1.5)+i*Math.PI*2/n,r=e.type==='authorBoss'?43:23;o.position.set(Math.cos(a)*r,20+Math.sin(a*1.4)*8,Math.sin(a)*r)});g.rotation.x=e.type==='authorBoss'?Math.sin(state.tick*1.3)*.08:0;g.visible=true;g.userData.hp=e.hp/e.maxHp;}
    for(const [id,g] of maps.enemies){if(!enemyIds.has(id)){scene.remove(g);maps.enemies.delete(id)}}
    const objIds=new Set();for(const o of state.interactables||[]){objIds.add(String(o.id));let g=maps.objects.get(String(o.id));if(!g){g=makeObject(o);maps.objects.set(String(o.id),g);scene.add(g)}const p=pos(o.x,o.y,0);g.position.set(p.x,0,p.z);g.rotation.y=o.type==='npc'?Math.sin(state.tick*.4)*.08:0;g.visible=!(o.used&&o.type!=='npc');if(o.used&&o.type!=='npc')g.visible=false;if(g.userData.shard){g.userData.shard.rotation.y=state.tick*1.2;g.userData.shard.rotation.x=Math.sin(state.tick)*.2;g.userData.shard.position.y=22+Math.sin(state.tick*2+o.x)*3;if(o.type==='authorSigil'){g.userData.shard.rotation.x=state.tick*.8;g.userData.aura.material=mats.rose;}}if(g.userData.portal){g.userData.portal.rotation.y=state.tick*.25;g.userData.inner.material.opacity=.14+Math.sin(state.tick*2)*.07}if(g.userData.aura)g.userData.aura.rotation.z=state.tick*.5;}
    for(const [id,g] of maps.objects){if(!objIds.has(id)){scene.remove(g);maps.objects.delete(id)}}
  }
  function syncParticles(state,dt){
    const arr=(state.particles||[]).slice(- (mobileQuality?100:220));state.particles=arr;while(maps.particles.length<arr.length){const m=sphere(scene,0,-10000,0,1,mats.cyan,8);m.material=m.material.clone();maps.particles.push(m)}
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
    if(player.userData.cloak)player.userData.cloak.scale.y=1+Math.sin(state.tick*5)*.035;const gait=Math.min(1,Math.hypot(p.vx||0,p.vy||0)/40);const limbs=player.userData.limbs;if(limbs){const swing=Math.sin(state.tick*10)*.55*gait;limbs.legL.rotation.x=swing;limbs.legR.rotation.x=-swing;limbs.armL.rotation.x=-swing*.7;limbs.armR.rotation.x=swing*.7;}if((p.hitTimer||0)>0){playHeroAction('Hit',.05);}else if(p.attack>0){if(player.userData.sword)player.userData.sword.rotation.z=-Math.sin((p.attack/.32)*Math.PI)*.85;playHeroAction('Attack',.07);}else if((p.castTimer||0)>0){if(player.userData.sword)player.userData.sword.rotation.z=0;playHeroAction('Cast',.09);}else{if(player.userData.sword)player.userData.sword.rotation.z=0;playHeroAction(gait>.12?'Run':'Idle',.18);}if(heroMixer)heroMixer.update(dt);
    if(player.userData.visor)player.userData.visor.material=state.className==='Dawnbreaker'?mats.gold:state.className==='Paradoxist'?mats.crystal:state.className==='Hollowkeeper'?mats.ghost:mats.cyan;
    player.visible=!(p.invuln>0&&Math.floor(state.tick*20)%2===0);
    slashRing.visible=(p.slash||0)>0;slashRing.rotation.z=state.tick*2;slashRing.material=state.className==='Dawnbreaker'?mats.gold:mats.cyan;slashRing.scale.setScalar(1+Math.max(0,p.slash||0)*1.8);
    const forward=pos(p.x+(p.faceX||0)*95,p.y+(p.faceY||0)*95,0);
    const camY=state.activeZone==='author-archive'?350:state.activeZone==='forgotten-city'?330:300;const desired=v(pp.x-(p.faceX||0)*65,camY,pp.z+360-(p.faceY||0)*75);
    camera.position.lerp(desired,.085);camera.lookAt(v(pp.x+(p.faceX||0)*25,14,pp.z+(p.faceY||0)*25));
    // Light follow gives the hero a readable focal glow without flattening the night palette.
    warm.position.set(pp.x+35,62,pp.z-15);frame++;renderer.render(scene,camera);
  }
  window.Echoes3D={render,renderer,scene,version:'0.9.0',get loadedEnemyVariants(){return [...assetState.enemyTemplates.keys()]},get heroRigLoaded(){return !!player.userData.authoredRig;}};
})();
