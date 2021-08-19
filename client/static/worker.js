console.log("Service Worker Loaded...");

self.addEventListener("push", (e) => {
  console.log("heeelllo from here");
  const data = e.data.json();
  console.log(data);
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: data.body,
    // icon: "http://image.ibb.co/frYOFd/tmlogo.png",
  });
});
