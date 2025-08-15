import { ethers } from "ethers";
import fetch from "node-fetch";
import 'dotenv/config';

const provider = new ethers.WebSocketProvider(process.env.BLOCKCHAIN_RPC_WSS);
const abi = [
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event MetadataAssigned(uint256 indexed tokenId, uint256 indexed metadataId)"
];

const contractAddress = process.env.BLOCKCHAIN_CONTRACT_ADDRESS;

const contract = new ethers.Contract(contractAddress, abi, provider);

console.log("📡 Escutando eventos Transfer..." + `${process.env.LARAVEL_API_URL}/token-transfer`);

contract.on("Transfer", async (from, to, tokenId) => {
  console.log(`🔔 Token ${tokenId} transferido de ${from} para ${to}`);
  try {
    const response = await fetch(`${process.env.LARAVEL_API_URL}/token-transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.LARAVEL_API_KEY 
      },
      body: JSON.stringify({
        tokenId: tokenId.toString(),
        from,
        to
      })
    });

    if (!response.ok) {
      console.error("❌ Erro ao enviar para API:", await response.text());
    } else {
      console.log("✅ Evento enviado para API com sucesso!");
    }
  } catch (err) {
    console.error("❌ Falha ao enviar para API:", err.message);
  }
});

contract.on("MetadataAssigned", async (tokenId, metadataId) => {
  console.log(`🔔 Token ${tokenId} assigned com o metadata ${metadataId}`);
  try {
    const response = await fetch(`${process.env.LARAVEL_API_URL}/metadata-assigned`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.LARAVEL_API_KEY 
      },
      body: JSON.stringify({
        tokenId: tokenId.toString(),
        metadataId: metadataId.toString(),
      })
    });

    if (!response.ok) {
      console.error("❌ Erro ao enviar para API:", await response.text());
    } else {
      console.log("✅ Evento enviado para API com sucesso!");
    }
  } catch (err) {
    console.error("❌ Falha ao enviar para API:", err.message);
  }
});
