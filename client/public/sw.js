// Service Worker desativado para evitar erros
console.log("Service Worker desativado");

// Não instalar o service worker
self.addEventListener("install", function (event) {
  console.log("SW: Install event - desativado");
  // Não fazer nada
});

self.addEventListener("activate", function (event) {
  console.log("SW: Activate event - desativado");
  // Não fazer nada
});

// Não interceptar fetch requests
self.addEventListener("fetch", function (event) {
  // Não fazer nada - deixar as requests passarem normalmente
});
