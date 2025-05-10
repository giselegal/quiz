// Função para injetar favicon
(function() {
  // Injeta um favicon na página caso nenhum tenha sido carregado
  setTimeout(function() {
    var link = document.querySelector('link[rel="icon"]');
    if (!link || !link.href) {
      // Cria um novo link para o favicon
      var newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.type = 'image/x-icon';
      newLink.href = 'data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJaWlgCWlpYWlpaWPJaWljyWlpY8lpaWPJaWljyWlpY8lpaWPJaWljyWlpY8lpaWPJaWljyWlpYWlpaWAAAAAADU1NQA1NTUM9vb27nl5eX/5eXl/+Xl5f/l5eX/5eXl/+Xl5f/l5eX/5eXl/+Xl5f/l5eX/29vbucPDwzPS0tIAAAAAANjY2APe3t7V5eXl/+Xl5f/l5eX/5eXl/+Xl5f/l5eX/5eXl/+Xl5f/l5eX/5eXl/+Xl5f/e3t7V1tbWAwAAAADc3NwA3d3dj+Xl5f/l5eX/5eXl/9ra2v+9vb3/s7Oz/7S0tP/BwcH/29vb/+Xl5f/l5eX/3d3dj9zc3AAAAAAAlpaWAJaWlkzl5eX/5eXl/7+/v/91dXX/VlZW/0hISP9JSUn/WVlZ/3t7e//Hx8f/5eXl/5aWlkyWlpYAAAAAAJaWlgCWlpYIl5eXg87Ozv+GhYb/jYyN/4yLjP9zcnP/dHN0/42MjP+NjIz/i4qL/87Ozv+Xl5eDlpaWCJaWlgAAAAAAlpaWAJaWlgCWlpYVlpaWiI2MjP+1tLX/srGy/4OCg/+Eg4P/srKy/7W0tf+MjIz/lpaWiJaWlhWWlpYAlpaWAAAAAACWlpYAlpaWAJaWlgCWlpYeioqK/8/Pz//Ozc7/n56f/6CfoP/Ozs7/z8/P/4qKiv+WlpYelpaWAJaWlgCWlpYAAAAAAAAAAAAAAAAAAAAAAAAAAPLy8v/y8vL/8vLy//Ly8v/y8vL/8vLy//Ly8v/y8vL/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJaWlgCWlpYO5eXl/+Xl5f/l5eX/5eXl/+Xl5f/l5eX/5eXl/+Xl5f+WlpYOlpaWAAAAAAAAAAAAAAAAAAAAAAAAAAAAlpaWCOXl5f/l5eX/5eXl/+Xl5f/l5eX/5eXl/+Xl5f/l5eX/lpaWCJaWlgAAAAAAAAAAAAAAAAAAAAAAAAAAANjY2APe3t7e5eXl/+Xl5f/l5eX/5eXl/+Xl5f/l5eX/3t7e3tjY2AMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADd3d0A3d3di+Xl5f/l5eX/5eXl/+Xl5f/l5eX/5eXl/93d3Yvd3d0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1dXVANXV1TDe3t7g5eXl/+Xl5f/l5eX/5eXl/97e3uDV1dUw1dXVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADR0dEA0dHRDtXV1YfZ2dnQ2dnZ0NXV1YfR0dEO0dHRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP9/AAD+PwAA8B8AAMAHAADgAwAA8AcAAPgPAAD8HwAA+A8AAOAHAADwDwAA/j8AAP9/AAD//wAA';
      
      // Adiciona o novo link ao head do documento
      document.head.appendChild(newLink);
      console.log('Favicon injetado dinamicamente para garantir compatibilidade.');
    }
  }, 100);
})();
