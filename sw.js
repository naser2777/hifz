/* متابعة الحفظ — يعمل بلا إنترنت بعد أول فتح. غيّر رقم الإصدار عند كل تحديث */
const V="hifz-v3",RT="hifz-fonts";
const FILES=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-512-maskable.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("hifz-")&&k!==V&&k!==RT) /* لا تمسح مخازن التطبيقات الأخرى على نفس العنوان */.map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
 if(r.mode==="navigate"){e.respondWith(caches.match("./index.html").then(c=>c||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(ca=>ca.put("./index.html",cp))}return res})).catch(()=>caches.match("./index.html")));return}
 if(u.origin===location.origin){e.respondWith(caches.match(r).then(c=>c||fetch(r).then(res=>{if(res.ok){const cl=res.clone();caches.open(V).then(ca=>ca.put(r,cl))}return res})));return}
 if(u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com"){e.respondWith(caches.open(RT).then(ca=>ca.match(r).then(c=>{const f=fetch(r).then(res=>{ca.put(r,res.clone());return res}).catch(()=>c);return c||f})));return}
 e.respondWith(fetch(r).catch(()=>caches.match(r)));
});
