<?php
// Arquivo para testar a conexão com o domínio
echo "<html>";
echo "<head><title>Teste de Domínio - Gisele Galvão</title></head>";
echo "<body style='font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;'>";
echo "<h1 style='color: #b29670;'>Teste de Conexão do Domínio</h1>";
echo "<p>Se você está vendo esta página, significa que:</p>";
echo "<ol>";
echo "<li>O domínio <strong>giselegalvao.com.br</strong> está corretamente conectado ao servidor</li>";
echo "<li>O PHP está funcionando corretamente no servidor</li>";
echo "<li>O arquivo está na pasta correta que o domínio acessa</li>";
echo "</ol>";

echo "<h2>Informações do Servidor:</h2>";
echo "<ul>";
echo "<li><strong>Diretório atual:</strong> " . getcwd() . "</li>";
echo "<li><strong>Diretório raiz do servidor:</strong> " . $_SERVER['DOCUMENT_ROOT'] . "</li>";
echo "<li><strong>Nome do servidor:</strong> " . $_SERVER['SERVER_NAME'] . "</li>";
echo "<li><strong>Software do servidor:</strong> " . $_SERVER['SERVER_SOFTWARE'] . "</li>";
echo "</ul>";

echo "<h2>Estrutura de Diretórios:</h2>";
echo "<pre>";
$output = shell_exec('ls -la');
echo htmlspecialchars($output);
echo "</pre>";

echo "<p style='margin-top: 30px;'><a href='/' style='color: #b29670;'>Voltar para a página inicial</a></p>";
echo "</body>";
echo "</html>";
?>
