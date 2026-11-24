(function(){
"use strict";
console.log("VIP 3D v2 loaded");
/* If p.jpeg is missing from the folder, use a built-in copy of the logo */
var LOGO_BACKUP="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAEAAQADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD4yooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiig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eCNON/4q1u00uLBKJK2ZZfZIx8zH6Cvin9o39oLUviMj+HfD8M+leGFcGRHb99fEHIaXHCqDyEGRnkknGNPdjuCOI/aA8ft8SPihqfiOMOlhkW2nxv1S3j4TPoTyx92NcBRRXPKXM7jCiiipAKKKKACiiigAooooAKKKKACiiigArQ8O6xqGga5Z6zpc5gvLSUSxOPUdiO4IyCO4JFZ9FNNp3QH338PpfBPxC8G2XirT9GtI3lGy6tlZsW8643oRnGO445Uitq/WO2iEcSJGijCqowAPYCvj/wDZu+JTeAfF5ttQmYaBqhWK9XqIm/gmA/2SefVSfavrfxBOuzcjq6soZWVshgRkEEdQR3r7XKsXPFpKUrteZ6dCpzx8zA1K8wxGa5Dxz4wtvCvh241a42ySL8ltCT/rpT0X6dz7A+1aWqXCoJJZZFjjRSzuxwFUckk9gBXy/wDFXxc/ivxCXgZl021zHaIe4zy5926+wwO1etnGOjl+G9345aL/AD+Qq1TkXmc1rGo3mr6pc6nqE7T3VzIZJZG6sx/z07VDaf8AH1F/vr/OoqltP+PqL/fX+dfmjbbuzzT9gi37pP8AdH8qpXD1Ozfu1/3R/KqNw1aQQmfIv/BRI7j4J+l9/wC0a+qPhaqQfCzwlFGqoi6HZAAdB+4SvlT/AIKGnI8FH/r+/wDaNfUnw8nSH4YeGHkdURNDs2ZmIAVRboSST0AHOaJR94C3438T6R4S8M3/AIi127Frp9jEZJX6k9gqjuzHAA7k18DeLf2nPivqniO+vtH8Qvo2nSyk21jDbwusEf8ACu5kJY46nPJz06VN+1j8ZZPiN4m/sTRLhh4W0uU/Z8ZH2yUcGdh6dQg7DJ6sa8NqG+wz1Y/tF/Gg9fHN1/4CW/8A8bqlqvx2+Lup27QXXjzV1Ruot2WD9Y1U15tRS5mBY1C+vNQunu7+7nu7h/vyzSF3b6kkk1XoopAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAV3Xg/4r+MvDOmpplrexXdhGMRW95H5ixj0U5DAe2ce1cLRWtGtUoy5qbsyoycXdM63xh8Q/E/iiA2t/dpDaE5a3tk8tG+vdvoTXJUUUVq9SvLnqSbfmKUnJ3YVJbMqXEbv91XBP0zUdFZCP0Vf9qH4LlQB4nvOg/5hU/8A8TVWX9pr4Nt08TXZ/wC4XP8A/E1+elFWptCsfQn7YfxM8G/ET/hGP+ET1Oa9+wC6+0CS1kh2b/K2/fAznaenpU/xn/aDj1j4XaP8PfBv2qK3XS7a21a+kBjaXZEqtBGOuzI+ZjjdjAGM5+dKKTm27jCiiipAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Z";
document.querySelectorAll('img[src="p.jpeg"]').forEach(function(img){
  function swap(){img.src=LOGO_BACKUP}
  if(img.complete&&img.naturalWidth===0){swap()}else{img.addEventListener("error",swap,{once:true})}
});
var ico=document.querySelector('link[rel="icon"]');if(ico)ico.href=LOGO_BACKUP;

var EMAIL="softwaresvip60@gmail.com";
var nav=document.getElementById("nav"),mb=document.querySelector(".menu-btn");
function menu(o){nav.classList.toggle("show",o);mb.setAttribute("aria-expanded",String(o));mb.textContent=o?"✕":"☰"}
mb.addEventListener("click",function(){menu(!nav.classList.contains("show"))});
nav.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){menu(false)})});
document.addEventListener("keydown",function(e){if(e.key==="Escape")menu(false)});

/* 3D tilt cards */
var calm=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(!calm)document.querySelectorAll(".tilt").forEach(function(c){
  c.addEventListener("pointermove",function(e){if(e.pointerType==="touch")return;var r=c.getBoundingClientRect();
    c.style.setProperty("--ry",(((e.clientX-r.left)/r.width-.5)*18).toFixed(1)+"deg");
    c.style.setProperty("--rx",(-((e.clientY-r.top)/r.height-.5)*18).toFixed(1)+"deg")});
  c.addEventListener("pointerleave",function(){c.style.setProperty("--rx","0deg");c.style.setProperty("--ry","0deg")});
});

/* Contact form: sends to backend (/api/contact); falls back to the email app if the backend is unreachable */
var f=document.getElementById("form"),msg=document.getElementById("msg"),sending=false;
function mailFallback(n,m,s,b){
  location.href="mailto:"+EMAIL+"?subject="+encodeURIComponent(s)+"&body="+encodeURIComponent("Name: "+n+"\nEmail: "+m+"\n\n"+b);
  msg.textContent="Server not reachable. Opening your email app instead. Press send there to reach us.";msg.className="ok";
}
f.addEventListener("submit",function(e){e.preventDefault();
  if(sending)return;
  var n=f.name.value.trim(),m=f.email.value.trim(),s=f.subject.value.trim(),b=f.message.value.trim();
  if(!n||!m||!s||!b){msg.textContent="Fill in all fields.";msg.className="err";return}
  var btn=f.querySelector("button[type=submit]");sending=true;btn.disabled=true;msg.textContent="Sending...";msg.className="";
  fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({name:n,email:m,subject:s,message:b,website:f.website.value})})
  .then(function(r){return r.json().then(function(d){return{status:r.status,d:d}})})
  .then(function(x){
    if(x.d&&x.d.ok){msg.textContent="Thank you! Your enquiry has been received. We will get back to you soon.";msg.className="ok";f.reset()}
    else{msg.textContent=(x.d&&x.d.error)||"Something went wrong. Please try again.";msg.className="err"}
  })
  .catch(function(){mailFallback(n,m,s,b)})
  .then(function(){sending=false;btn.disabled=false});
});

/* 3D hero: VIP letters built as real 3D shapes (no image needed) */
var stage=document.getElementById("stage");
stage.setAttribute("aria-label","Rotating 3D VIP logo. Drag to spin.");
try{
  var W=stage.clientWidth,H=stage.clientHeight;
  var scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(40,W/H,.1,100);
  function fit(){cam.position.z=cam.aspect<1.3?14:11}
  fit();
  var ren=new THREE.WebGLRenderer({antialias:true,alpha:true});
  ren.shadowMap.enabled=true;
  ren.shadowMap.type=THREE.PCFSoftShadowMap;
  ren.setPixelRatio(Math.min(devicePixelRatio,2));ren.setSize(W,H);stage.appendChild(ren.domElement);
  scene.add(new THREE.AmbientLight(0xffffff,.75));
  var p1=new THREE.PointLight(0x9670ff,1.6,50);p1.position.set(5,4,7);scene.add(p1);
  var p2=new THREE.PointLight(0xffffff,.9,50);p2.position.set(-5,-3,6);scene.add(p2);
  var keyLight=new THREE.DirectionalLight(0xffffff,.9);
  keyLight.position.set(-4,6,8);keyLight.castShadow=true;
  keyLight.shadow.mapSize.set(512,512);keyLight.shadow.camera.near=.1;keyLight.shadow.camera.far=30;
  keyLight.shadow.bias=-.0005;keyLight.shadow.radius=2;scene.add(keyLight);
  var shadowPlane=new THREE.Mesh(new THREE.PlaneGeometry(12,10),new THREE.ShadowMaterial({opacity:.2}));
  shadowPlane.position.z=-2.5;shadowPlane.receiveShadow=true;scene.add(shadowPlane);
  var K=.0064,D=.7;
  function X(v){return (v-631)*K}
  function Y(v){return -(v-618)*K}
  function poly(pts){var s=new THREE.Shape();pts.forEach(function(p,i){if(i){s.lineTo(X(p[0]),Y(p[1]))}else{s.moveTo(X(p[0]),Y(p[1]))}});s.closePath();return s}
  function solid(shape,color,metal){
    var geo=new THREE.ExtrudeGeometry(shape,{depth:D,bevelEnabled:true,bevelThickness:.06,bevelSize:.05,bevelSegments:3,curveSegments:24});
    geo.translate(0,0,-D/2);
    var mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:color,roughness:.28,metalness:metal}));
    mesh.castShadow=true;mesh.receiveShadow=true;
    return mesh;
  }
  var g=new THREE.Group();scene.add(g);
  g.add(solid(poly([[222,462],[340,462],[470,665],[602,515],[602,640],[490,790],[410,790]]),0x9670ff,.35)); /* V */
  g.add(solid(poly([[630,540],[630,495],[725,425],[725,470]]),0xc9b8ff,.3));                              /* dot of I */
  g.add(solid(poly([[625,575],[725,495],[725,812],[625,812]]),0xf4f1ff,.2));                              /* I */
  var P=new THREE.Shape();                                                                                  /* P */
  P.moveTo(X(750),Y(472));P.lineTo(X(900),Y(472));
  P.bezierCurveTo(X(985),Y(472),X(1040),Y(520),X(1040),Y(592));
  P.bezierCurveTo(X(1040),Y(665),X(985),Y(712),X(900),Y(712));
  P.lineTo(X(840),Y(712));P.lineTo(X(748),Y(812));P.lineTo(X(750),Y(472));
  var hole=new THREE.Path();
  hole.moveTo(X(840),Y(538));hole.lineTo(X(905),Y(538));
  hole.bezierCurveTo(X(940),Y(538),X(962),Y(560),X(962),Y(592));
  hole.bezierCurveTo(X(962),Y(625),X(940),Y(648),X(905),Y(648));
  hole.lineTo(X(840),Y(648));hole.closePath();
  P.holes.push(hole);
  g.add(solid(P,0xf4f1ff,.2));

  var r1=new THREE.Mesh(new THREE.TorusGeometry(3.9,.02,16,140),new THREE.MeshBasicMaterial({color:0x9670ff}));r1.rotation.x=1.2;g.add(r1);
  var r2=new THREE.Mesh(new THREE.TorusGeometry(3.4,.02,16,140),new THREE.MeshBasicMaterial({color:0x5b6bd6}));r2.rotation.y=1.2;g.add(r2);
  var geos=[new THREE.OctahedronGeometry(.28),new THREE.IcosahedronGeometry(.25),new THREE.TetrahedronGeometry(.3),new THREE.BoxGeometry(.3,.3,.3),new THREE.TorusGeometry(.2,.07,12,24)];
  var bits=geos.map(function(geo,i){var m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:i%2?0xc9b8ff:0x8d66f7,roughness:.3,metalness:.5}));
    m.castShadow=true;m.userData={a:i*1.26,rad:3.3+(i%3)*.3,y:(i-2)*.7,s:.4+i*.08};g.add(m);return m});
  bits.forEach(function(m){var d=m.userData;m.position.set(Math.cos(d.a)*d.rad,d.y,Math.sin(d.a)*d.rad)});
  var mx=0,my=0,drag=false,lx=0,spin=0;
  stage.addEventListener("pointermove",function(e){var r=stage.getBoundingClientRect();mx=(e.clientX-r.left)/r.width-.5;my=(e.clientY-r.top)/r.height-.5;
    if(drag){spin+=(e.clientX-lx)*.01;lx=e.clientX}});
  stage.addEventListener("pointerdown",function(e){drag=true;lx=e.clientX;stage.style.cursor="grabbing"});
  addEventListener("pointerup",function(){drag=false;stage.style.cursor="grab"});
  var t=0,vis=true;
  new IntersectionObserver(function(en){vis=en[0].isIntersecting}).observe(stage);
  function loop(){requestAnimationFrame(loop);if(!vis)return;
    t+=calm?0:.01;
    g.rotation.y+=((Math.sin(t*.8)*.45+mx*.8+spin)-g.rotation.y)*.06;
    g.rotation.x+=((my*.5)-g.rotation.x)*.06;
    g.position.y=Math.sin(t*1.2)*.12;
    r1.rotation.z=t*.6;r2.rotation.z=-t*.5;
    bits.forEach(function(m){var d=m.userData;d.a+=calm?0:.016*d.s;
      m.position.set(Math.cos(d.a)*d.rad,d.y+Math.sin(t+d.a)*.2,Math.sin(d.a)*d.rad);m.rotation.x+=.01;m.rotation.y+=.014});
    ren.render(scene,cam)}
  loop();
  addEventListener("resize",function(){var w=stage.clientWidth,h=stage.clientHeight;ren.setSize(w,h);cam.aspect=w/h;fit();cam.updateProjectionMatrix()});
}catch(err){var fb=stage.querySelector(".fallback");if(fb)fb.style.display="grid"}
})();