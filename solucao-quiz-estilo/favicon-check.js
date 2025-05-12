// Verificação de favicon no console durante o desenvolvimento
document.addEventListener('DOMContentLoaded', function() {
  // Só verifica em ambiente de desenvolvimento
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setTimeout(() => {
      const faviconLink = document.querySelector('link[rel="icon"]');
      if (faviconLink) {
        const img = new Image();
        img.src = faviconLink.href;
        img.onload = function() {
          console.log('✅ Favicon carregado com sucesso:', faviconLink.href);
        };
        img.onerror = function() {
          console.error('❌ Falha ao carregar o favicon:', faviconLink.href);
          console.info('Dica: Verifique se o caminho está correto e se o arquivo existe na pasta public/.');
        };
      } else {
        console.warn('⚠️ Não foi encontrado link para favicon no documento.');
      }
    }, 1000);
  }
});
