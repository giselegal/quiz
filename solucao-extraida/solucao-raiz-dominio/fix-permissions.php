<?php
header('Content-Type: text/html; charset=utf-8');
echo "<html><head><title>Correção de Permissões</title>
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
echo "<h1>Correção de Permissões de Arquivos</h1>";

// Verificar confirmação
if (isset($_GET['confirm']) && $_GET['confirm'] === 'yes') {
    function fix_permissions($dir) {
        if (!is_dir($dir)) {
            echo "<p class='error'>Diretório não encontrado: " . htmlspecialchars($dir) . "</p>";
            return;
        }
        
        echo "<div class='info-box'>";
        echo "<h2>Corrigindo permissões em: " . htmlspecialchars($dir) . "</h2>";
        
        try {
            $iterator = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
                RecursiveIteratorIterator::SELF_FIRST
            );
            
            echo "<ul>";
            foreach ($iterator as $path) {
                $isDir = $path->isDir();
                $oldPerms = substr(sprintf('%o', $path->getPerms()), -4);
                
                if ($isDir) {
                    chmod($path->getPathname(), 0755);
                } else {
                    chmod($path->getPathname(), 0644);
                }
                
                $newPerms = substr(sprintf('%o', $path->getPerms()), -4);
                
                echo "<li>";
                echo htmlspecialchars($path->getPathname()) . " ";
                echo "[" . ($isDir ? "Diretório" : "Arquivo") . "]: ";
                echo $oldPerms . " → " . $newPerms;
                echo "</li>";
            }
            echo "</ul>";
            
            echo "<p class='success'>Permissões corrigidas: diretórios para 755, arquivos para 644</p>";
        } catch (Exception $e) {
            echo "<p class='error'>Erro ao corrigir permissões: " . $e->getMessage() . "</p>";
        }
        
        echo "</div>";
    }

    // Corrigir permissões na pasta atual
    fix_permissions('.');
    
    echo "<div class='info-box'>";
    echo "<h2>Próximos Passos</h2>";
    echo "<p><a href='diagnostico.php' style='color: #b29670; font-weight: bold;'>Voltar ao diagnóstico</a></p>";
    echo "</div>";
} else {
    // Mostrar confirmação
    echo "<div class='info-box'>";
    echo "<h2>⚠️ Atenção ⚠️</h2>";
    echo "<p>Esta ação irá corrigir as permissões de todos os arquivos e diretórios.</p>";
    echo "<p>Diretórios serão definidos como 755 (drwxr-xr-x).</p>";
    echo "<p>Arquivos serão definidos como 644 (rw-r--r--).</p>";
    echo "<p>Você tem certeza que deseja prosseguir?</p>";
    echo "<p><a href='?confirm=yes' style='color: #b29670; font-weight: bold;'>Sim, corrigir permissões</a></p>";
    echo "<p><a href='diagnostico.php' style='color: #b29670;'>Cancelar e voltar ao diagnóstico</a></p>";
    echo "</div>";
}

echo "</body></html>";
