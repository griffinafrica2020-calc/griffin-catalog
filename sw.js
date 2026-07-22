/* Griffin Africa — Service Worker (تخزين للعمل بلا إنترنت) */
const CACHE="griffin-v21";
const ASSETS=["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./img/bestchoice.webp", "./img/bigga_bbq.webp", "./img/bigga_sc.webp", "./img/carre_d.webp", "./img/carre_n.webp", "./img/corners_b.webp", "./img/corners_k.webp", "./img/datebar.webp", "./img/delicia_n.webp", "./img/delisso8.webp", "./img/delisso_m.webp", "./img/dukes_bourbon.webp", "./img/dukes_cream150.webp", "./img/dukes_dots.webp", "./img/fave_choco.webp", "./img/fave_straw.webp", "./img/fave_vanilla.webp", "./img/glite_10.webp", "./img/glite_15.webp", "./img/glite_18.webp", "./img/glite_28.webp", "./img/glite_38.webp", "./img/glite_5.webp", "./img/goslos.webp", "./img/griffin.webp", "./img/griffin_hero.webp", "./img/gringo.webp", "./img/happ_eclair.webp", "./img/happ_mintz.webp", "./img/happ_toffee.webp", "./img/jo_cake.webp", "./img/jo_para.webp", "./img/jo_swiss.webp", "./img/l_dukes.webp", "./img/l_fave.webp", "./img/l_glite.webp", "./img/l_jordina.webp", "./img/l_nabil.webp", "./img/l_saudia.webp", "./img/l_toren.webp", "./img/l_truda.webp", "./img/l_vista.webp", "./img/l_wazir.webp", "./img/milkmalt.webp", "./img/mio.webp", "./img/mrbite.webp", "./img/nice.webp", "./img/nova.webp", "./img/nusso.webp", "./img/saudia25.webp", "./img/saudia900.webp", "./img/sixer.webp", "./img/sp_bbq.webp", "./img/sp_chut.webp", "./img/sp_pele.webp", "./img/vista_basmati.webp", "./img/vista_mazza.webp", "./img/wazir_floral.webp", "./img/wazir_highfoam.webp", "./img/wazir_lemon.webp", "./img/wazir_powder_p.webp", "./img/wazir_powder_r.webp", "./img/wazir_roses.webp", "./img/wazir_toilet.webp", "./img/wf_flowers.webp", "./img/wf_lemon.webp", "./img/wf_nature.webp", "./img/wf_rose.webp", "./img/wf_sea.webp", "./img/wonderful.webp", "./img/xtreme.webp"];
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  const isDoc = e.request.mode==="navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("index.html");
  if(isDoc){
    // الشبكة أولاً لصفحة HTML → أحدث نسخة دائماً عند وجود إنترنت
    e.respondWith(
      fetch(e.request).then(res=>{
        if(res&&res.ok){ const clone=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,clone)); }
        return res;
      }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(h=>h||caches.match("./index.html")))
    );
    return;
  }
  // الصور والأصول: الذاكرة أولاً (أسرع)
  e.respondWith(
    caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(res=>{
      if(res.ok&&url.origin===location.origin){ const clone=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,clone)); }
      return res;
    }).catch(()=>caches.match("./index.html")))
  );
});
