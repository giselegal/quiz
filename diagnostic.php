<?php
header('Content-Type: text/html; charset=utf-8');
echo "<html><head><title>Diagnóstico giselegalvao.com.br</title></head><body>";
echo "<h1>Diagnóstico do Servidor</h1>";
echo "<p>Data/hora atual: " . date('Y-m-d H:i:s') . "</p>";

echo "<h2>Informações do Servidor</h2>";
echo "<pre>";
echo "PHP Version: " . phpversion() . "\n";
echo "Server Software: " . $_SERVER['SERVER_SOFTWARE'] . "\n";
echo "Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "\n";
echo "Script Filename: " . $_SERVER['SCRIPT_FILENAME'] . "\n";
echo "</pre>";

echo "<h2>Estrutura de Diretórios</h2>";
echo "<pre>";
system('ls -la');
echo "</pre>";

echo "<h2>Conteúdo do .htaccess</h2>";
echo "<pre>";
if (file_exists('.htaccess')) {
    echo htmlspecialchars(file_get_contents('.htaccess'));
} else {
    echo "Arquivo .htaccess não encontrado";
}
echo "</pre>";

echo "<h2>Verificação de Arquivos Críticos</h2>";
echo "<ul>";
foreach (['index.html', 'index.php', 'wp-config.php'] as $file) {
    echo "<li>";
    echo $file . ": ";
    if (file_exists($file)) {
        echo "<span style='color:green'>Encontrado</span>";
    } else {
        echo "<span style='color:red'>Não encontrado</span>";
    }
    echo "</li>";
}
echo "</ul>";

echo "</body></html>";
