# Resumo Visual: Substituição WordPress → React

## Diagrama do Processo

```
╔════════════════════╗     ╔════════════════════╗     ╔════════════════════╗
║                    ║     ║                    ║     ║                    ║
║ 1. PREPARAÇÃO      ║ ──▶ ║ 2. BACKUP          ║ ──▶ ║ 3. IMPLEMENTAÇÃO   ║
║                    ║     ║                    ║     ║                    ║
╚════════════════════╝     ╚════════════════════╝     ╚════════════════════╝
       │                          │                          │
       ▼                          ▼                          ▼
┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐
│• Baixar pacote     │   │• Upload de         │   │• Upload de todos   │
│  solução           │   │  diagnostico.php   │   │  os arquivos React │
│• Backup local dos  │   │• Mover WordPress   │   │• Verificar         │
│  arquivos atuais   │   │  para backup/      │   │  permissões        │
└────────────────────┘   └────────────────────┘   └────────────────────┘
```

## Checklist Passo a Passo 

### Antes de começar:
- [ ] Baixar `solucao-raiz-dominio.zip`
- [ ] Extrair o arquivo em seu computador
- [ ] Fazer backup local do site WordPress atual

### Na Hostinger:
1. [ ] Fazer upload dos arquivos de diagnóstico:
   - [ ] `diagnostico.php`
   - [ ] `backup-wordpress.php` 
   - [ ] `fix-permissions.php`

2. [ ] Executar backup do WordPress:
   - [ ] Acessar `https://giselegalvao.com.br/diagnostico.php`
   - [ ] Clicar em "Fazer backup dos arquivos WordPress"
   - [ ] Confirmar a operação

3. [ ] Implementar a aplicação React:
   - [ ] Fazer upload de todos os arquivos da solução para `public_html/`
   - [ ] Verificar se `.htaccess` foi incluído

4. [ ] Verificar e testar:
   - [ ] Acessar `https://giselegalvao.com.br/diagnostico.php`
   - [ ] Corrigir permissões se necessário
   - [ ] Testar o site em `https://giselegalvao.com.br/`

### Reversão (se necessário):
- [ ] Remover arquivos React
- [ ] Restaurar arquivos WordPress da pasta `wordpress_backup/`

## Estrutura Final do Servidor

```
public_html/
│
├── index.html                # Página principal do React
├── .htaccess                 # Configuração para SPA
├── assets/                   # Arquivos CSS/JS do React
│   ├── index-*.js
│   └── index-*.css
│
├── diagnostico.php           # Ferramenta de diagnóstico
├── backup-wordpress.php      # Ferramenta de backup
├── fix-permissions.php       # Corretor de permissões
│
├── wordpress_backup/         # Backup do WordPress original
│   ├── wp-admin/
│   ├── wp-content/
│   ├── wp-includes/
│   └── ...
│
└── quiz-de-estilo/           # Subdiretório existente (não alterado)
    ├── index.html
    └── ...
```
