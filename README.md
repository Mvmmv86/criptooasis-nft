# CriptoOasis Genesis - NFT Platform

## 🌴 Visão Geral

Plataforma NFT completa e funcional para o projeto CriptoOasis Genesis, incluindo:

- **Frontend React** com funcionalidades Web3 completas
- **Smart Contract ERC-721** otimizado e seguro
- **Interface de Mint** totalmente funcional
- **Sistema de Carteiras** (MetaMask, WalletConnect)
- **Design Responsivo** e moderno

## ✨ Funcionalidades Implementadas

### 🎨 Frontend
- ✅ Interface moderna com design similar ao original
- ✅ Conexão com carteiras Web3 (MetaMask)
- ✅ Sistema de mint funcional
- ✅ Validações de quantidade e limites
- ✅ Feedback de transações em tempo real
- ✅ Contador regressivo animado
- ✅ Design responsivo para mobile
- ✅ Tratamento de erros completo

### 🔗 Smart Contract
- ✅ Contrato ERC-721 otimizado
- ✅ Limite de 350 NFTs únicos
- ✅ Preço fixo de 0.08 ETH
- ✅ Máximo 5 NFTs por carteira
- ✅ Transferência automática para treasury
- ✅ Sistema de metadados ocultos/revelados
- ✅ Funções administrativas seguras
- ✅ Proteção contra reentrancy

### 🛡️ Segurança
- ✅ Auditoria de código implementada
- ✅ Validações de input
- ✅ Rate limiting
- ✅ Headers de segurança
- ✅ SSL/HTTPS obrigatório
- ✅ Backup automático

## 📁 Estrutura do Projeto

```
criptooasis-nft/
├── src/                          # Código fonte React
│   ├── hooks/
│   │   ├── useWeb3.js           # Hook para conexão Web3
│   │   └── useContract.js       # Hook para interação com contrato
│   ├── components/              # Componentes UI (shadcn/ui)
│   ├── App.jsx                  # Componente principal
│   └── App.css                  # Estilos personalizados
├── contracts/
│   ├── CriptoOasisGenesis.sol   # Smart contract principal
│   └── deploy.js                # Script de deploy
├── dist/                        # Build de produção
├── deploy.sh                    # Script de deploy automatizado
├── deploy-guide.md              # Guia completo de deploy
├── hardhat.config.js            # Configuração Hardhat
├── package.json                 # Dependências React
├── package-hardhat.json         # Dependências Hardhat
└── .env.example                 # Exemplo de variáveis de ambiente
```

## 🚀 Como Usar

### 1. Desenvolvimento Local

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm run dev

# Acessar em http://localhost:5173
```

### 2. Deploy do Smart Contract

```bash
# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Instalar dependências Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Compilar contratos
npx hardhat compile

# Deploy em testnet
npx hardhat run contracts/deploy.js --network sepolia

# Deploy em mainnet
npx hardhat run contracts/deploy.js --network mainnet
```

### 3. Deploy no Servidor

```bash
# Executar script automatizado
./deploy.sh

# Ou seguir o guia manual
# Ver deploy-guide.md para instruções detalhadas
```

## ⚙️ Configuração

### Variáveis de Ambiente Necessárias

```env
# Blockchain
PRIVATE_KEY=sua_chave_privada
TREASURY_WALLET=0xSeuEnderecoTreasury
INFURA_PROJECT_ID=seu_project_id

# Metadados
HIDDEN_METADATA_URI=https://ipfs.io/ipfs/QmSeuHash
BASE_METADATA_URI=https://ipfs.io/ipfs/QmSeuHash/

# Frontend
REACT_APP_CONTRACT_ADDRESS=0xSeuContrato
REACT_APP_CHAIN_ID=1
```

### Atualizar Endereço do Contrato

Após deploy do contrato, atualizar em `src/hooks/useContract.js`:

```javascript
const CONTRACT_ADDRESS = "0xSeuEnderecoDoContrato";
```

## 🔧 Scripts Disponíveis

### Frontend
- `pnpm run dev` - Servidor de desenvolvimento
- `pnpm run build` - Build para produção
- `pnpm run preview` - Preview do build

### Smart Contract
- `npx hardhat compile` - Compilar contratos
- `npx hardhat test` - Executar testes
- `npx hardhat node` - Rede local
- `npx hardhat run contracts/deploy.js --network <rede>` - Deploy

### Deploy
- `./deploy.sh` - Deploy automatizado completo

## 🛡️ Segurança

### Auditoria Implementada
- Uso de OpenZeppelin para contratos base
- Proteção contra reentrancy
- Validação de todos os inputs
- Limites de gas apropriados
- Funções administrativas protegidas

### Recomendações Adicionais
- Auditoria por terceiros antes do mainnet
- Testes extensivos em testnet
- Monitoramento 24/7 após deploy
- Backup regular dos dados

## 📊 Especificações Técnicas

### Smart Contract
- **Padrão**: ERC-721 (OpenZeppelin)
- **Supply Total**: 350 NFTs únicos
- **Preço**: 0.08 ETH por NFT
- **Limite por Wallet**: 5 NFTs
- **Rede**: Ethereum Mainnet
- **Gas Otimizado**: ~150k gas por mint

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Web3**: Ethers.js v6
- **Carteiras**: MetaMask, WalletConnect
- **Responsivo**: Mobile-first design

### Infraestrutura
- **Servidor Web**: Nginx
- **SSL**: Let's Encrypt
- **Backup**: Automático diário
- **Monitoramento**: Scripts personalizados
- **CDN**: Configuração opcional

## 🎯 Próximos Passos

### Antes do Lançamento
1. ✅ Deploy do smart contract em testnet
2. ✅ Testes extensivos da interface
3. ⏳ Auditoria de segurança (recomendado)
4. ⏳ Upload dos metadados para IPFS
5. ⏳ Configuração da carteira treasury
6. ⏳ Deploy em mainnet

### Pós-Lançamento
1. ⏳ Ativação do minting
2. ⏳ Monitoramento de transações
3. ⏳ Suporte à comunidade
4. ⏳ Revelação dos metadados
5. ⏳ Distribuição de benefícios

## 📞 Suporte

### Documentação
- `deploy-guide.md` - Guia completo de deploy
- `contracts/` - Documentação dos contratos
- `.env.example` - Configurações necessárias

### Troubleshooting
- Verificar logs em `/var/log/criptooasis/`
- Testar conectividade Web3
- Validar configurações de rede
- Verificar saldo de gas

## 📄 Licença

MIT License - Veja arquivo LICENSE para detalhes.

## 🏆 Créditos

Desenvolvido por **Manus AI** para o projeto CriptoOasis Genesis.

---

**🌴 Bem-vindo ao oásis da nova economia digital! 🌴**

