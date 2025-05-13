<?php
header('Content-Type: text/html; charset=utf-8');
echo "<html><head><title>Backup WordPress</title>
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
echo "<h1>Backup dos Arquivos WordPress</h1>";

// Verificar se o backup já foi confirmado
if (isset($_GET['confirm']) && $_GET['confirm'] === 'yes') {
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
        if (mkdir('wordpress_backup', 0755, true)) {
            echo "<p class='success'>Diretório de backup criado: wordpress_backup</p>";
        } else {
            echo "<p class='error'>Falha ao criar diretório de backup</p>";
        }
    }

    echo "<div class='info-box'>";
    echo "<h2>Movendo arquivos para backup:</h2><ul>";

    foreach ($wp_files as $file) {
        if (file_exists($file)) {
            $destination = 'wordpress_backup/' . basename($file);
            
            if (is_dir($file)) {
                // Mover diretório recursivamente
                if (rename($file, $destination)) {
                    echo "<li class='success'>Diretório movido: " . htmlspecialchars($file) . " → " . htmlspecialchars($destination) . "</li>";
                } else {
                    echo "<li class='error'>Falha ao mover diretório: " . htmlspecialchars($file) . "</li>";
                }
            } else {
                // Mover arquivo
                if (rename($file, $destination)) {
                    echo "<li class='success'>Arquivo movido: " . htmlspecialchars($file) . " → " . htmlspecialchars($destination) . "</li>";
                } else {
                    echo "<li class='error'>Falha ao mover arquivo: " . htmlspecialchars($file) . "</li>";
                }
            }
        } else {
            echo "<li class='warning'>Arquivo/diretório não encontrado: " . htmlspecialchars($file) . "</li>";
        }
    }

    echo "</ul>";
    echo "</div>";
    
    echo "<div class='info-box'>";
    echo "<h2>Próximos Passos</h2>";
    echo "<p>Agora você pode fazer upload dos arquivos da sua aplicação React/Vite.</p>";
    echo "<p><a href='diagnostico.php' style='color: #b29670; font-weight: bold;'>Verificar diagnóstico</a></p>";
    echo "</div>";
} else {
    // Mostrar confirmação
    echo "<div class='info-box'>";
    echo "<h2>⚠️ Atenção ⚠️</h2>";
    echo "<p>Esta ação irá mover todos os arquivos do WordPress para uma pasta de backup.</p>";
    echo "<p>Você tem certeza que deseja prosseguir?</p>";
    echo "<p><a href='?confirm=yes' style='color: #dc3545; font-weight: bold;'>Sim, fazer backup e remover WordPress</a></p>";
    echo "<p><a href='diagnostico.php' style='color: #b29670;'>Cancelar e voltar ao diagnóstico</a></p>";
    echo "</div>";
}

echo "</body></html>";
