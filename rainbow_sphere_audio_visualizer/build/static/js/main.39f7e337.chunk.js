(this.webpackJsonprainbow_sphere_audio_visualizer=this.webpackJsonprainbow_sphere_audio_visualizer||[]).push([[0],{51:function(e,t,n){},66:function(e,t,n){},77:function(e,t,n){"use strict";n.r(t);var c=n(2),r=n.n(c),s=n(29),a=n.n(s),i=(n(66),n(14)),o=(n(51),n(19)),u=n(0),j=n(12);var l=function(e){var t=Object(c.useRef)();function n(n){var r=n.sound,s=Object(c.useRef)();return Object(c.useEffect)((function(){s.current=new u.AudioAnalyser(r.current,128)}),[r]),Object(o.b)((function(){if(s.current){var n=s.current.getFrequencyData();t.current.scale.x=t.current.scale.y=t.current.scale.z=(n[2*e.index]-(c=0))*(1.5-(r=.25))/(255-c)+r}var c,r})),Object(j.jsx)(j.Fragment,{})}return Object(j.jsxs)(j.Fragment,{children:[Object(j.jsxs)("mesh",{position:e.position,ref:t,children:[Object(j.jsx)("sphereGeometry",{args:[.5,20,20]}),Object(j.jsx)("meshPhongMaterial",{color:function(){var t,n,c;return t=parseInt(128*(Math.sin(e.angle-Math.PI)+1)),n=parseInt(128*(Math.sin(e.angle-Math.PI-4*Math.PI/3)+1)),c=parseInt(128*(Math.sin(e.angle-Math.PI-2*Math.PI/3)+1)),new u.Color("rgb(".concat(t,", ").concat(n,", ").concat(c,")"))}()})]}),Object(j.jsx)(n,{sound:e.sound})]})},b=n(94),h=n(59),p=n.n(h),O=n(60),d=n.n(O),f=n(95),x=n(49);var g=function(){var e=Object(c.useRef)(),t=Object(c.useState)(!0),n=Object(i.a)(t,2),r=n[0],s=n[1];return Object(j.jsxs)("div",{className:"App",children:[Object(j.jsxs)(o.a,{children:[Object(j.jsx)("ambientLight",{intensity:.2}),Object(j.jsx)("directionalLight",{position:[0,0,5]}),Object(j.jsxs)(c.Suspense,{fallback:null,children:[Object(j.jsx)(f.a,{url:"./Riviere.mp3",distance:10,loop:!0,ref:e}),function(){for(var t=2*Math.PI/20,n=Math.PI/2,c=[],r=0;r<20;r++){var s=5*Math.cos(n),a=5*Math.sin(n),i="sphere_".concat(r),o=r<10?r:20-r;c.push(Object(j.jsx)(l,{position:[s,a,-10],radius:.25,angle:n,sound:e,index:o},i)),n+=t}return c}(),Object(j.jsxs)(x.b,{multisampling:0,children:[Object(j.jsx)(x.a,{intensity:.5,luminanceThreshold:0,luminanceSmoothing:.8}),Object(j.jsx)(x.c,{})]})]})]}),Object(j.jsx)(b.a,{size:"small",color:"primary","aria-label":"play",style:{position:"absolute",top:20,left:20},onClick:function(){r?e.current.pause():e.current.play(),s(!r)},children:r?Object(j.jsx)(d.a,{}):Object(j.jsx)(p.a,{})})]})},m=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,96)).then((function(t){var n=t.getCLS,c=t.getFID,r=t.getFCP,s=t.getLCP,a=t.getTTFB;n(e),c(e),r(e),s(e),a(e)}))};a.a.render(Object(j.jsx)(r.a.StrictMode,{children:Object(j.jsx)(g,{})}),document.getElementById("root")),m()}},[[77,1,2]]]);
//# sourceMappingURL=main.39f7e337.chunk.js.map