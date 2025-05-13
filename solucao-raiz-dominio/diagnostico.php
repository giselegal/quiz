<?php
header('Content-Type: text/html; charset=utf-8');
echo "<html><head><title>Diagnóstico - giselegalvao.com.br</title>
<style>
body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
h1 { color: #b29670; border-bottom: 1px solid #b29670; padding-bottom: 10px; }
.info-box { background-color: #f8f9fa; border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 5px; }
pre { background-color: #f1f1f1; padding: 10px; border-radius: 4px; overflow-x: auto; }
.success { color: #28a745; font-weight: bold; }
.error { color: #dc3545; font-weight: bold; }
.warning { color: #ffc107; font-weight: bold; }
</style>
</head><body>";
echo "<h1>Diagnóstico do Domínio Principal</h1>";
echo "<p>Data/hora atual: " . date('Y-m-d H:i:s') . "</p>";

echo "<div class='info-box'>";
echo "<h2>Informações do Servidor</h2>";
echo "<pre>";
echo "PHP Version: " . phpversion() . "\n";
echo "Server Software: " . $_SERVER['SERVER_SOFTWARE'] . "\n";
echo "Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "\n";
echo "Script Filename: " . $_SERVER['SCRIPT_FILENAME'] . "\n";
echo "Remote Addr: " . $_SERVER['REMOTE_ADDR'] . "\n";
echo "HTTP Host: " . $_SERVER['HTTP_HOST'] . "\n";
echo "URI: " . $_SERVER['REQUEST_URI'] . "\n";
echo "</pre>";
echo "</div>";

echo "<div class='info-box'>";
echo "<h2>Estrutura de Diretórios</h2>";
echo "<pre>";
system('ls -la');
echo "</pre>";
echo "</div>";

echo "<div class='info-box'>";
echo "<h2>Conteúdo do .htaccess</h2>";
echo "<pre>";
if (file_exists('.htaccess')) {
    echo htmlspecialchars(file_get_contents('.htaccess'));
} else {
    echo "<span class='error'>Arquivo .htaccess não encontrado</span>";
}
echo "</pre>";
echo "</div>";

echo "<div class='info-box'>";
echo "<h2>Verificação de Arquivos Críticos</h2>";
echo "<ul>";
foreach (['index.html', 'index.php', 'wp-config.php'] as $file) {
    echo "<li>";
    echo $file . ": ";
    if (file_exists($file)) {
        echo "<span class='success'>Encontrado</span>";
        
        if ($file == 'index.php') {
            echo " - ";
            $content = file_get_contents($file);
            if (strpos($content, 'WordPress') !== false) {
                echo "<span class='error'>É um arquivo WordPress</span>";
            } else {
                echo "<span class='success'>Não parece ser WordPress</span>";
            }
        }
    } else {
        echo "<span class='error'>Não encontrado</span>";
    }
    echo "</li>";
}
echo "</ul>";
echo "</div>";

echo "<div class='info-box'>";
echo "<h2>Ações Disponíveis</h2>";
echo "<p><a href='backup-wordpress.php' style='color: #b29670; font-weight: bold;'>Fazer backup dos arquivos WordPress</a></p>";
echo "<p><a href='fix-permissions.php' style='color: #b29670; font-weight: bold;'>Corrigir permissões de arquivos</a></p>";
echo "<p><a href='https://giselegalvao.com.br/' style='color: #b29670; font-weight: bold;'>Ir para a página inicial</a></p>";
echo "</div>";

echo "</body></html>";
