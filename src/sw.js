// // '/index.html',
// // '/static/css/main.71bb5dc8.chunk.css',
// // '/static/js/1.3101dea3.chunk.js',
// // '/static/js/main.d494b740.chunk.js',
// // '/static/js/runtime~main.229c360f.js'
//
//
// // Step 1 : Register
// export function register(){
//   // const swUrl = `${process.env.PUBLIC_URL}/sw.js`;
//   const swUrl = `/sw.js`;
//
//   if (navigator.serviceWorker) {
//     navigator.serviceWorker.register(swUrl).then((registration) => {
//     }).catch(console.log("AW SHUCKS"));
//   }
// }
//
// export function unregister() {
//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.ready.then(registration => {
//       registration.unregister();
//     });
//   }
// }
//
// // Service Worker
// // const pwaCache = 'pwa-cache-1';
// //
// //
// // //set up the cache on installing SW
// // window.addEventListener('install', e => {
// //
// //
// //   let cacheReady = caches.open(pwaCache).then( cache => {
// //     console.log('new cache ready');
// //     return cache.addAll([
// //
// //     ]);
// //   })
// //
// //   e.waitUntil(cacheReady)
// // })
// //
// //
// // //listen to activate to clean up old caches
// //
// // window.addEventListener('activate', e => {
// //
// //   let cachesCleaned = caches.keys().then( keys => {
// //     keys.forEach(key => {
// //       if (key !== pwaCache) {
// //         return caches.delete(key)
// //       }
// //     })
// //   })
// //   e.waitUntil(cachesCleaned);
// // })
// //
// //
// // //send cached stuff when fetches are called
// //
// //
// // window.addEventListener('fetch', e => {
// //
// //   //if not local, don't bother trying to get from cache
// //   if ( !e.request.url === window.location.origin) return;
// //
// //   //is local, lets get from cache
// //   let newRes = caches.open(pwaCache).then( cache => {
// //     return cache.match(e.request).then( res => {
// //
// //       //check request was found in cache
// //       if (res) {
// //         console.log(`Serving ${res.url} from cache`);
// //         return res;
// //       }
// //
// //       //fetch on behalf of client and then cache
// //       return fetch(e.request).then( fetchRes => {
// //
// //         //next line is complicated.
// //         //shouldnt just use add() bc that calls a fetch, unnecessary
// //         //need to clone since fetchRes can only be consumed once
// //         cache.put(e.request, fetchRes.clone())
// //         return fetchRes;
// //       })
// //
// //     });
// //   })
// //   e.respondWith(newRes);
// //
// // })
// //
