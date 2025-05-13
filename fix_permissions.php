<?php
header('Content-Type: text/html; charset=utf-8');
echo "<html><head><title>Correção de Permissões</title></head><body>";
echo "<h1>Correção de Permissões de Arquivos</h1>";

function fix_permissions($dir) {
    if (!is_dir($dir)) {
        echo "<p>Diretório não encontrado: " . htmlspecialchars($dir) . "</p>";
        return;
    }
    
    echo "<h2>Corrigindo permissões em: " . htmlspecialchars($dir) . "</h2>";
    
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
    
    echo "<p>Permissões corrigidas: diretórios para 755, arquivos para 644</p>";
}

fix_permissions('.');

echo "<p><a href='diagnostic.php'>Voltar ao diagnóstico</a></p>";
echo "</body></html>";
