// Interceptador global para substituir URLs problemáticas
(function () {
  // Interceptar tentativas de carregar via.placeholder.com
  const originalCreateElement = document.createElement;
  document.createElement = function (tagName) {
    const element = originalCreateElement.call(this, tagName);

    if (tagName.toLowerCase() === "img") {
      const originalSetAttribute = element.setAttribute;
      element.setAttribute = function (name, value) {
        if (
          name === "src" &&
          typeof value === "string" &&
          value.includes("via.placeholder.com")
        ) {
          console.warn("🔄 Interceptando URL problemática:", value);
          // Substituir pela nossa URL local
          if (
            value.includes("120x40") &&
            value.includes("3b82f6") &&
            value.includes("text=LOGO")
          ) {
            value = "/logo-placeholder.svg";
          } else {
            value = "/placeholder.svg";
          }
          console.log("✅ URL substituída por:", value);
        }
        return originalSetAttribute.call(this, name, value);
      };

      // Interceptar também a propriedade src diretamente
      Object.defineProperty(element, "src", {
        get: function () {
          return this.getAttribute("src");
        },
        set: function (value) {
          if (
            typeof value === "string" &&
            value.includes("via.placeholder.com")
          ) {
            console.warn("🔄 Interceptando src problemática:", value);
            if (
              value.includes("120x40") &&
              value.includes("3b82f6") &&
              value.includes("text=LOGO")
            ) {
              value = "/logo-placeholder.svg";
            } else {
              value = "/placeholder.svg";
            }
            console.log("✅ Src substituída por:", value);
          }
          this.setAttribute("src", value);
        },
      });
    }

    return element;
  };

  // Interceptar fetch requests
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    if (typeof input === "string" && input.includes("via.placeholder.com")) {
      console.warn("🔄 Interceptando fetch para URL problemática:", input);
      if (
        input.includes("120x40") &&
        input.includes("3b82f6") &&
        input.includes("text=LOGO")
      ) {
        input = "/logo-placeholder.svg";
      } else {
        input = "/placeholder.svg";
      }
      console.log("✅ Fetch redirecionado para:", input);
    }
    return originalFetch.call(this, input, init);
  };

  console.log("🛡️ Interceptador de URLs problemáticas ativado");
})();
