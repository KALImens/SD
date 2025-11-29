
const CACHE_NAME='fahrzeug-manager-v1';
const PRECACHE=[
 './','./index.html','./offline.html','./manifest.json',
 './icons/icon-192.png','./icons/icon-256.png','./icons/icon-384.png','./icons/icon-512.png'
];

self.addEventListener('install',e=>{
 self.skipWaiting();
 e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(PRECACHE)));
});
self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))))
});
self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET') return;
 if(req.mode==='navigate'){
  e.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(CACHE_NAME).then(cc=>cc.put(req,c));return r;})
  .catch(()=>caches.match(req).then(r=>r||caches.match('./offline.html'))));
  return;
 }
 e.respondWith(caches.match(req).then(c=>c||fetch(req).then(r=>{const cl=r.clone();caches.open(CACHE_NAME).then(cc=>cc.put(req,cl));return r;})));
});
