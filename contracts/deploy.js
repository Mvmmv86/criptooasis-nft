const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Iniciando deploy do CriptoOasis Genesis NFT...");
    
    // Configurações do contrato
    const TREASURY_WALLET = process.env.TREASURY_WALLET || "0x0000000000000000000000000000000000000000";
    const HIDDEN_METADATA_URI = process.env.HIDDEN_METADATA_URI || "https://gateway.pinata.cloud/ipfs/QmYourHiddenMetadataHash";
    
    if (TREASURY_WALLET === "0x0000000000000000000000000000000000000000") {
        throw new Error("❌ TREASURY_WALLET não configurada! Defina a variável de ambiente.");
    }
    
    // Obter o deployer
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying com a conta:", deployer.address);
    console.log("💰 Saldo da conta:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");
    
    // Deploy do contrato
    console.log("📦 Fazendo deploy do contrato...");
    const CriptoOasisGenesis = await ethers.getContractFactory("CriptoOasisGenesis");
    
    const contract = await CriptoOasisGenesis.deploy(
        deployer.address,  // owner inicial
        TREASURY_WALLET,   // carteira treasury
        HIDDEN_METADATA_URI // URI dos metadados ocultos
    );
    
    await contract.deployed();
    
    console.log("✅ Contrato deployado com sucesso!");
    console.log("📍 Endereço do contrato:", contract.address);
    console.log("👤 Owner:", deployer.address);
    console.log("🏦 Treasury Wallet:", TREASURY_WALLET);
    console.log("🔗 Hidden Metadata URI:", HIDDEN_METADATA_URI);
    
    // Verificar configurações do contrato
    console.log("\n🔍 Verificando configurações...");
    const mintPrice = await contract.MINT_PRICE();
    const maxSupply = await contract.MAX_SUPPLY();
    const maxPerWallet = await contract.MAX_PER_WALLET();
    const mintingActive = await contract.mintingActive();
    
    console.log("💎 Preço de mint:", ethers.utils.formatEther(mintPrice), "ETH");
    console.log("📊 Supply máximo:", maxSupply.toString());
    console.log("🎯 Máximo por carteira:", maxPerWallet.toString());
    console.log("🟢 Minting ativo:", mintingActive);
    
    // Salvar informações do deploy
    const deployInfo = {
        contractAddress: contract.address,
        deployerAddress: deployer.address,
        treasuryWallet: TREASURY_WALLET,
        hiddenMetadataURI: HIDDEN_METADATA_URI,
        mintPrice: ethers.utils.formatEther(mintPrice),
        maxSupply: maxSupply.toString(),
        maxPerWallet: maxPerWallet.toString(),
        network: (await ethers.provider.getNetwork()).name,
        blockNumber: contract.deployTransaction.blockNumber,
        transactionHash: contract.deployTransaction.hash,
        deployedAt: new Date().toISOString()
    };
    
    console.log("\n📄 Informações do deploy salvas em deploy-info.json");
    
    // Instruções pós-deploy
    console.log("\n📋 PRÓXIMOS PASSOS:");
    console.log("1. Verificar o contrato no Etherscan:");
    console.log(`   https://etherscan.io/address/${contract.address}`);
    console.log("2. Atualizar o endereço do contrato no frontend:");
    console.log(`   CONTRACT_ADDRESS = "${contract.address}"`);
    console.log("3. Configurar metadados no IPFS");
    console.log("4. Ativar o minting quando estiver pronto:");
    console.log(`   contract.toggleMinting()`);
    console.log("5. Revelar metadados após o mint:");
    console.log(`   contract.setBaseURI("https://gateway.pinata.cloud/ipfs/QmYourMetadataHash/")`);
    console.log(`   contract.reveal()`);
    
    return deployInfo;
}

// Executar deploy
main()
    .then((deployInfo) => {
        console.log("\n🎉 Deploy concluído com sucesso!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Erro no deploy:", error);
        process.exit(1);
    });

