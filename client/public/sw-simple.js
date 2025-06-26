// Service Worker simples para evitar erros
console.log("Service Worker simples carregado");

self.addEventListener("install", function (event) {
  console.log("SW: Install event");
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  console.log("SW: Activate event");
  return self.clients.claim();
});

// Não intercepta fetch requests para evitar problemas
self.addEventListener("fetch", function (event) {
  // Passa todas as requests direto para a rede
  return;
});
