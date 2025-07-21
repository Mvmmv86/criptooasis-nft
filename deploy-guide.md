# Guia de Deploy - CriptoOasis Genesis NFT

## Visão Geral

Este guia fornece instruções completas para fazer o deploy do site NFT CriptoOasis Genesis em um servidor próprio com o domínio criptoasis.com. O projeto inclui:

- Frontend React com funcionalidades Web3 completas
- Smart contract NFT ERC-721 otimizado
- Sistema de conexão com carteiras (MetaMask, WalletConnect)
- Interface de mint funcional
- Design responsivo e moderno

## Pré-requisitos

### Servidor
- Ubuntu 20.04+ ou CentOS 8+
- Mínimo 2GB RAM, 20GB storage
- Acesso root ou sudo
- Domínio criptoasis.com apontando para o servidor

### Desenvolvimento
- Node.js 18+ e npm/pnpm
- Git para versionamento
- Carteira Ethereum para deploy do contrato
- Infura ou Alchemy para RPC

## Estrutura do Projeto

```
criptooasis-nft/
├── src/                    # Código fonte React
│   ├── hooks/             # Hooks Web3 personalizados
│   ├── components/        # Componentes UI
│   └── App.jsx           # Componente principal
├── contracts/             # Smart contracts Solidity
│   ├── CriptoOasisGenesis.sol
│   └── deploy.js
├── dist/                  # Build de produção
├── hardhat.config.js      # Configuração Hardhat
├── package.json           # Dependências React
└── package-hardhat.json   # Dependências Hardhat
```

## Fase 1: Preparação do Ambiente

### 1.1 Atualização do Sistema

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências essenciais
sudo apt install -y curl wget git unzip nginx certbot python3-certbot-nginx
```

### 1.2 Instalação do Node.js

```bash
# Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version  # deve mostrar v20.x.x
npm --version   # deve mostrar 10.x.x

# Instalar pnpm globalmente
npm install -g pnpm
```

### 1.3 Configuração do Firewall

```bash
# Configurar UFW
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

## Fase 2: Deploy do Smart Contract

### 2.1 Configuração do Ambiente Blockchain

```bash
# Navegar para o diretório do projeto
cd /var/www/criptooasis

# Instalar dependências do Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts dotenv
```

### 2.2 Configuração das Variáveis de Ambiente

```bash
# Criar arquivo .env
cp .env.example .env
nano .env
```

Configurar as seguintes variáveis:

```env
# Chave privada da carteira de deploy (NUNCA COMPARTILHE!)
PRIVATE_KEY=sua_chave_privada_aqui

# Endereço da carteira treasury (Gnosis Safe recomendada)
TREASURY_WALLET=0xSeuEnderecoTreasuryAqui

# Infura Project ID
INFURA_PROJECT_ID=seu_project_id_infura

# Etherscan API Key
ETHERSCAN_API_KEY=sua_api_key_etherscan

# URIs dos metadados
HIDDEN_METADATA_URI=https://gateway.pinata.cloud/ipfs/QmSeuHashOculto
BASE_METADATA_URI=https://gateway.pinata.cloud/ipfs/QmSeuHashRevelado/
```

### 2.3 Deploy do Contrato

```bash
# Compilar contratos
npx hardhat compile

# Deploy em testnet primeiro (recomendado)
npx hardhat run contracts/deploy.js --network sepolia

# Deploy em mainnet (após testes)
npx hardhat run contracts/deploy.js --network mainnet
```

### 2.4 Verificação do Contrato

```bash
# Verificar no Etherscan
npx hardhat verify --network mainnet ENDERECO_DO_CONTRATO "ENDERECO_OWNER" "ENDERECO_TREASURY" "URI_OCULTA"
```

## Fase 3: Configuração do Frontend

### 3.1 Atualização do Endereço do Contrato

Após o deploy do contrato, atualizar o arquivo `src/hooks/useContract.js`:

```javascript
// Substituir o endereço placeholder
const CONTRACT_ADDRESS = "0xSeuEnderecoDoContratoAqui";
```

### 3.2 Build de Produção

```bash
# Instalar dependências
pnpm install

# Fazer build para produção
pnpm run build

# Verificar se a pasta dist foi criada
ls -la dist/
```

## Fase 4: Configuração do Servidor Web

### 4.1 Estrutura de Diretórios

```bash
# Criar estrutura de diretórios
sudo mkdir -p /var/www/criptooasis
sudo mkdir -p /var/log/criptooasis
sudo mkdir -p /var/backups/criptooasis

# Definir permissões
sudo chown -R $USER:$USER /var/www/criptooasis
```

### 4.2 Upload dos Arquivos

```bash
# Copiar arquivos do build para o servidor
sudo cp -r dist/* /var/www/criptooasis/

# Verificar arquivos
ls -la /var/www/criptooasis/
```

### 4.3 Configuração do Nginx

Criar arquivo de configuração:

```bash
sudo nano /etc/nginx/sites-available/criptooasis
```

Conteúdo da configuração:

```nginx
server {
    listen 80;
    server_name criptooasis.com www.criptooasis.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name criptooasis.com www.criptooasis.com;

    # Certificados SSL (serão configurados pelo Certbot)
    ssl_certificate /etc/letsencrypt/live/criptooasis.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/criptooasis.com/privkey.pem;
    
    # Configurações SSL modernas
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
        try_files $uri $uri/ /index.html;
        
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
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;
}
```

### 4.4 Ativação da Configuração

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/criptooasis /etc/nginx/sites-enabled/

# Remover configuração padrão
sudo rm /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx
```

## Fase 5: Configuração SSL

### 5.1 Obtenção do Certificado

```bash
# Obter certificado SSL
sudo certbot --nginx -d criptooasis.com -d www.criptooasis.com

# Configurar renovação automática
sudo crontab -e
# Adicionar linha: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 5.2 Teste do SSL

```bash
# Testar configuração SSL
curl -I https://criptooasis.com

# Verificar redirecionamento HTTP para HTTPS
curl -I http://criptooasis.com
```

## Fase 6: Monitoramento e Backup

### 6.1 Script de Backup

```bash
# Criar script de backup
sudo nano /usr/local/bin/backup-criptooasis.sh
```

Conteúdo do script:

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/criptooasis"
APP_DIR="/var/www/criptooasis"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="criptooasis_backup_$DATE.tar.gz"

# Criar backup
tar -czf "$BACKUP_DIR/$BACKUP_FILE" -C "$APP_DIR" .

# Manter apenas os últimos 7 backups
find "$BACKUP_DIR" -name "criptooasis_backup_*.tar.gz" -mtime +7 -delete

echo "$(date): Backup criado: $BACKUP_FILE" >> /var/log/criptooasis/backup.log
```

```bash
# Tornar executável
sudo chmod +x /usr/local/bin/backup-criptooasis.sh

# Configurar execução diária
sudo crontab -e
# Adicionar: 0 2 * * * /usr/local/bin/backup-criptooasis.sh
```

### 6.2 Monitoramento de Status

```bash
# Criar script de monitoramento
sudo nano /usr/local/bin/monitor-criptooasis.sh
```

Conteúdo:

```bash
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
```

```bash
# Tornar executável
sudo chmod +x /usr/local/bin/monitor-criptooasis.sh

# Executar a cada 5 minutos
sudo crontab -e
# Adicionar: */5 * * * * /usr/local/bin/monitor-criptooasis.sh
```

## Fase 7: Ativação do Projeto

### 7.1 Ativação do Minting

Após verificar que tudo está funcionando:

```bash
# Conectar ao contrato e ativar minting
# (usar Remix, Hardhat console ou interface web)
contract.toggleMinting()
```

### 7.2 Configuração dos Metadados

```bash
# Fazer upload dos metadados para IPFS
# Configurar URI base no contrato
contract.setBaseURI("https://gateway.pinata.cloud/ipfs/QmSeuHash/")

# Revelar metadados (após mint completo ou quando desejado)
contract.reveal()
```

## Fase 8: Testes Finais

### 8.1 Checklist de Verificação

- [ ] Site acessível via https://criptooasis.com
- [ ] Redirecionamento HTTP para HTTPS funcionando
- [ ] Certificado SSL válido e seguro
- [ ] Botão "Conectar Wallet" funcionando
- [ ] Interface de mint responsiva
- [ ] Contrato verificado no Etherscan
- [ ] Minting ativo (se desejado)
- [ ] Logs sem erros críticos

### 8.2 Testes de Performance

```bash
# Testar velocidade
curl -o /dev/null -s -w "Tempo total: %{time_total}s\n" https://criptooasis.com

# Verificar headers de segurança
curl -I https://criptooasis.com

# Testar compressão
curl -H "Accept-Encoding: gzip" -I https://criptooasis.com
```

### 8.3 Ferramentas de Validação Online

- **SSL Labs**: https://www.ssllabs.com/ssltest/
- **GTmetrix**: https://gtmetrix.com/
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Security Headers**: https://securityheaders.com/

## Troubleshooting

### Problemas Comuns

**Site não carrega:**
1. Verificar se Nginx está rodando: `sudo systemctl status nginx`
2. Verificar logs: `sudo tail -f /var/log/nginx/criptooasis_error.log`
3. Testar configuração: `sudo nginx -t`

**Erro de SSL:**
1. Renovar certificado: `sudo certbot renew`
2. Verificar configuração SSL no Nginx
3. Verificar DNS do domínio

**Conectar Wallet não funciona:**
1. Verificar console do navegador para erros JavaScript
2. Verificar se MetaMask está instalado
3. Verificar se está na rede correta (Mainnet)

**Contrato não responde:**
1. Verificar endereço do contrato no código
2. Verificar se contrato está deployado
3. Verificar RPC endpoint (Infura/Alchemy)

## Manutenção Contínua

### Tarefas Diárias
- Verificar logs de erro
- Monitorar métricas de acesso
- Verificar status do contrato

### Tarefas Semanais
- Verificar backups automáticos
- Revisar logs de segurança
- Monitorar performance

### Tarefas Mensais
- Atualizar sistema operacional
- Revisar configurações de segurança
- Analisar métricas de uso

## Conclusão

Seguindo este guia, você terá uma plataforma NFT completamente funcional rodando no domínio criptooasis.com. O sistema inclui:

- Interface moderna e responsiva
- Funcionalidades Web3 completas
- Smart contract seguro e otimizado
- Infraestrutura robusta e monitorada
- Configurações de segurança avançadas

Para suporte adicional ou dúvidas, consulte a documentação técnica ou entre em contato com a equipe de desenvolvimento.

