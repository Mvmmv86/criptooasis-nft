#!/bin/bash

# Script de Deploy Automatizado - CriptoOasis Genesis NFT
# Autor: Manus AI
# Versão: 1.0

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções de log
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se está rodando como root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_error "Este script não deve ser executado como root!"
        exit 1
    fi
}

# Verificar dependências
check_dependencies() {
    log_info "Verificando dependências..."
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js não encontrado. Instale Node.js 18+ primeiro."
        exit 1
    fi
    
    # Verificar npm/pnpm
    if ! command -v pnpm &> /dev/null; then
        log_warning "pnpm não encontrado. Instalando..."
        npm install -g pnpm
    fi
    
    # Verificar Nginx
    if ! command -v nginx &> /dev/null; then
        log_error "Nginx não encontrado. Instale o Nginx primeiro."
        exit 1
    fi
    
    log_success "Todas as dependências estão instaladas."
}

# Fazer build da aplicação
build_application() {
    log_info "Fazendo build da aplicação..."
    
    # Instalar dependências
    pnpm install
    
    # Fazer build
    pnpm run build
    
    # Verificar se build foi criado
    if [ ! -d "dist" ]; then
        log_error "Build falhou! Diretório dist não encontrado."
        exit 1
    fi
    
    log_success "Build concluído com sucesso."
}

# Configurar diretórios do servidor
setup_directories() {
    log_info "Configurando diretórios do servidor..."
    
    # Criar diretórios necessários
    sudo mkdir -p /var/www/criptooasis
    sudo mkdir -p /var/log/criptooasis
    sudo mkdir -p /var/backups/criptooasis
    
    # Definir permissões
    sudo chown -R $USER:$USER /var/www/criptooasis
    sudo chown -R $USER:$USER /var/log/criptooasis
    
    log_success "Diretórios configurados."
}

# Deploy dos arquivos
deploy_files() {
    log_info "Fazendo deploy dos arquivos..."
    
    # Backup da versão anterior (se existir)
    if [ -d "/var/www/criptooasis/index.html" ]; then
        log_info "Fazendo backup da versão anterior..."
        sudo tar -czf "/var/backups/criptooasis/backup_$(date +%Y%m%d_%H%M%S).tar.gz" -C /var/www/criptooasis .
    fi
    
    # Copiar novos arquivos
    sudo cp -r dist/* /var/www/criptooasis/
    
    # Definir permissões corretas
    sudo chown -R www-data:www-data /var/www/criptooasis
    sudo chmod -R 755 /var/www/criptooasis
    
    log_success "Arquivos deployados com sucesso."
}

# Configurar Nginx
configure_nginx() {
    log_info "Configurando Nginx..."
    
    # Verificar se configuração já existe
    if [ -f "/etc/nginx/sites-available/criptooasis" ]; then
        log_warning "Configuração do Nginx já existe. Pulando..."
        return
    fi
    
    # Criar configuração do Nginx
    sudo tee /etc/nginx/sites-available/criptooasis > /dev/null <<EOF
server {
    listen 80;
    server_name criptooasis.com www.criptooasis.com;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name criptooasis.com www.criptooasis.com;

    # Certificados SSL (configurados pelo Certbot)
    ssl_certificate /etc/letsencrypt/live/criptooasis.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/criptooasis.com/privkey.pem;
    
    # Configurações SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Diretório raiz
    root /var/www/criptooasis;
    index index.html;

    # Configuração para SPA
    location / {
        try_files \$uri \$uri/ /index.html;
        
        # Headers de segurança
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval'" always;
    }

    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Logs
    access_log /var/log/nginx/criptooasis_access.log;
    error_log /var/log/nginx/criptooasis_error.log;

    # Compressão
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;
}
EOF
    
    # Ativar site
    sudo ln -sf /etc/nginx/sites-available/criptooasis /etc/nginx/sites-enabled/
    
    # Remover configuração padrão se existir
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Testar configuração
    if sudo nginx -t; then
        log_success "Configuração do Nginx criada com sucesso."
    else
        log_error "Erro na configuração do Nginx!"
        exit 1
    fi
}

# Configurar SSL
setup_ssl() {
    log_info "Configurando SSL..."
    
    # Verificar se certificado já existe
    if [ -f "/etc/letsencrypt/live/criptooasis.com/fullchain.pem" ]; then
        log_warning "Certificado SSL já existe. Pulando..."
        return
    fi
    
    # Recarregar Nginx primeiro
    sudo systemctl reload nginx
    
    log_info "Execute o comando abaixo para obter o certificado SSL:"
    log_info "sudo certbot --nginx -d criptooasis.com -d www.criptooasis.com"
    
    read -p "Pressione Enter após configurar o SSL..."
}

# Configurar scripts de manutenção
setup_maintenance_scripts() {
    log_info "Configurando scripts de manutenção..."
    
    # Script de backup
    sudo tee /usr/local/bin/backup-criptooasis.sh > /dev/null <<'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/criptooasis"
APP_DIR="/var/www/criptooasis"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="criptooasis_backup_$DATE.tar.gz"

tar -czf "$BACKUP_DIR/$BACKUP_FILE" -C "$APP_DIR" .
find "$BACKUP_DIR" -name "criptooasis_backup_*.tar.gz" -mtime +7 -delete
echo "$(date): Backup criado: $BACKUP_FILE" >> /var/log/criptooasis/backup.log
EOF
    
    # Script de monitoramento
    sudo tee /usr/local/bin/monitor-criptooasis.sh > /dev/null <<'EOF'
#!/bin/bash
LOG_FILE="/var/log/criptooasis/monitor.log"

# Verificar Nginx
if ! systemctl is-active --quiet nginx; then
    echo "$(date): ERRO - Nginx parado, reiniciando..." >> $LOG_FILE
    systemctl restart nginx
fi

# Verificar site
if ! curl -f -s https://criptooasis.com > /dev/null; then
    echo "$(date): ERRO - Site inacessível" >> $LOG_FILE
fi

# Verificar espaço em disco
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "$(date): AVISO - Espaço em disco baixo: $DISK_USAGE%" >> $LOG_FILE
fi
EOF
    
    # Tornar scripts executáveis
    sudo chmod +x /usr/local/bin/backup-criptooasis.sh
    sudo chmod +x /usr/local/bin/monitor-criptooasis.sh
    
    log_success "Scripts de manutenção configurados."
    log_info "Para configurar execução automática, adicione ao crontab:"
    log_info "0 2 * * * /usr/local/bin/backup-criptooasis.sh"
    log_info "*/5 * * * * /usr/local/bin/monitor-criptooasis.sh"
}

# Verificar status final
check_status() {
    log_info "Verificando status final..."
    
    # Verificar Nginx
    if systemctl is-active --quiet nginx; then
        log_success "Nginx está rodando."
    else
        log_error "Nginx não está rodando!"
    fi
    
    # Verificar arquivos
    if [ -f "/var/www/criptooasis/index.html" ]; then
        log_success "Arquivos deployados corretamente."
    else
        log_error "Arquivos não encontrados!"
    fi
    
    # Testar acesso local
    if curl -f -s http://localhost > /dev/null; then
        log_success "Site acessível localmente."
    else
        log_warning "Site pode não estar acessível. Verifique a configuração."
    fi
}

# Função principal
main() {
    log_info "=== Deploy CriptoOasis Genesis NFT ==="
    log_info "Iniciando processo de deploy..."
    
    check_root
    check_dependencies
    build_application
    setup_directories
    deploy_files
    configure_nginx
    setup_ssl
    setup_maintenance_scripts
    
    # Recarregar Nginx
    sudo systemctl reload nginx
    
    check_status
    
    log_success "=== Deploy concluído com sucesso! ==="
    log_info "Próximos passos:"
    log_info "1. Configure o certificado SSL se ainda não foi feito"
    log_info "2. Atualize o endereço do contrato no código"
    log_info "3. Faça deploy do smart contract"
    log_info "4. Ative o minting quando estiver pronto"
    log_info "5. Configure monitoramento e backups automáticos"
    log_info ""
    log_info "Site disponível em: https://criptooasis.com"
}

# Executar função principal
main "$@"

