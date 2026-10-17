/* Cherry & Pudding offline helper. Version 20261017123237 */
const SHELL='cp-shell-20261017123237',MEDIA='cp-media';
self.addEventListener('install',e=>{e.waitUntil(caches.open(SHELL).then(c=>c.addAll(['./','index.html','manifest.webmanifest','icon-192.png','favicon.png'])).catch(()=>{}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('cp-shell')&&k!==SHELL).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  const media=u.origin===location.origin&&/\.(jpe?g|png|webp|mp3)$/.test(u.pathname);
  const font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(media||font){e.respondWith(caches.open(MEDIA).then(c=>c.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==='opaque')c.put(r,res.clone());return res}))));return}
  if(u.origin!==location.origin)return;
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(SHELL).then(c=>c.put(r,cp))}return res})
    .catch(()=>caches.match(r,{ignoreSearch:true}).then(h=>h||(r.mode==='navigate'?caches.match('index.html'):undefined))));
});
