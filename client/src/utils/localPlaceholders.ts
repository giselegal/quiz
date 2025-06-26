// Utilitário para substituir placeholders externos por imagens locais ou SVGs inline

export const getLocalPlaceholder = (type: "logo" | "image", size?: string) => {
  if (type === "logo") {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%23B89B7A'/%3E%3Ctext x='48' y='55' font-family='Arial, sans-serif' font-size='12' fill='white' text-anchor='middle'%3ELogo%3C/text%3E%3C/svg%3E";
  }

  if (type === "image") {
    const [width, height] = size ? size.split("x").map(Number) : [640, 480];
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='%23f0f0f0'/%3E%3Ctext x='${
      width / 2
    }' y='${
      height / 2
    }' font-family='Arial, sans-serif' font-size='20' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3EImagem%3C/text%3E%3C/svg%3E`;
  }

  return "";
};

export const replacePlaceholderUrl = (url: string): string => {
  if (!url) return "";

  // Se já é uma URL local ou data URI, retorna como está
  if (
    url.startsWith("/") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  // Substitui placeholders problemáticos
  if (url.includes("via.placeholder.com")) {
    if (url.includes("96x96") && url.includes("Logo")) {
      return getLocalPlaceholder("logo");
    }
    if (url.includes("640x480") && url.includes("Imagem")) {
      return getLocalPlaceholder("image", "640x480");
    }
    return getLocalPlaceholder("image");
  }

  return url;
};
