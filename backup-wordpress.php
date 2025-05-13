<?php
header('Content-Type: text/html; charset=utf-8');
echo "<html><head><title>Backup WordPress</title></head><body>";
echo "<h1>Backup dos Arquivos WordPress</h1>";

// Arquivos típicos do WordPress
$wp_files = array(
    'wp-config.php',
    'wp-login.php',
    'wp-admin',
    'wp-content',
    'wp-includes',
    'index.php'
);

// Criar diretório de backup
if (!is_dir('wordpress_backup')) {
    mkdir('wordpress_backup', 0755, true);
    echo "<p>Diretório de backup criado: wordpress_backup</p>";
}

echo "<h2>Movendo arquivos para backup:</h2><ul>";

foreach ($wp_files as $file) {
    if (file_exists($file)) {
        $destination = 'wordpress_backup/' . basename($file);
        
        if (is_dir($file)) {
            // Mover diretório recursivamente
            if (rename($file, $destination)) {
                echo "<li>Diretório movido: " . htmlspecialchars($file) . " → " . htmlspecialchars($destination) . "</li>";
            } else {
                echo "<li style='color:red;'>Falha ao mover diretório: " . htmlspecialchars($file) . "</li>";
            }
        } else {
            // Mover arquivo
            if (rename($file, $destination)) {
                echo "<li>Arquivo movido: " . htmlspecialchars($file) . " → " . htmlspecialchars($destination) . "</li>";
            } else {
                echo "<li style='color:red;'>Falha ao mover arquivo: " . htmlspecialchars($file) . "</li>";
            }
        }
    } else {
        echo "<li>Arquivo/diretório não encontrado: " . htmlspecialchars($file) . "</li>";
    }
}

echo "</ul>";
echo "<p><a href='diagnostic.php'>Voltar ao diagnóstico</a></p>";
echo "</body></html>";
