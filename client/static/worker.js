console.log("Service Worker Loaded...");

self.addEventListener("push", (e) => {
  console.log("heeelllo from here");
  const data = e.data.json();
  console.log(data);
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "https://raw.githubusercontent.com/daviesesiro/WSCMS/e8142a87ddc75dea519a4a1cef99e9fb2a4dd854/client/static/images/icons/icon-96x96.png?token=AG5NEH5VLV5X3SW7HVOXTPTBE6AGU",
  });
});

const staticDev = "wscms-site-v1";
const assets = ["/", "/index.html", "/dashboard.html", "/client.js"];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticDev).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
