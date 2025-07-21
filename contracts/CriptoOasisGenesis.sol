// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title CriptoOasisGenesis
 * @dev NFT contract for CriptoOasis Genesis collection
 * @author CriptoOasis Team
 */
contract CriptoOasisGenesis is ERC721, ERC721Enumerable, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using Strings for uint256;
    
    // ============ CONSTANTS ============
    uint256 public constant MINT_PRICE = 0.08 ether;
    uint256 public constant MAX_SUPPLY = 350;
    uint256 public constant MAX_PER_WALLET = 5;
    uint256 public constant MAX_PER_TRANSACTION = 5;
    
    // ============ STATE VARIABLES ============
    Counters.Counter private _tokenIdCounter;
    address payable public immutable treasuryWallet;
    bool public mintingActive = false;
    bool public revealed = false;
    string private _baseTokenURI;
    string private _hiddenMetadataURI;
    
    // Mapping para controlar limite por wallet
    mapping(address => uint256) public mintedByWallet;
    
    // ============ EVENTS ============
    event MintingStatusChanged(bool active);
    event NFTMinted(address indexed to, uint256 indexed tokenId, uint256 quantity);
    event FundsWithdrawn(address indexed to, uint256 amount);
    event BaseURIChanged(string newBaseURI);
    event HiddenMetadataURIChanged(string newHiddenURI);
    event Revealed(bool revealed);
    
    // ============ MODIFIERS ============
    modifier mintingIsActive() {
        require(mintingActive, "Minting is not active");
        _;
    }
    
    modifier validMintQuantity(uint256 quantity) {
        require(quantity > 0, "Quantity must be greater than 0");
        require(quantity <= MAX_PER_TRANSACTION, "Exceeds max per transaction");
        require(
            mintedByWallet[msg.sender] + quantity <= MAX_PER_WALLET,
            "Exceeds max per wallet"
        );
        require(
            _tokenIdCounter.current() + quantity <= MAX_SUPPLY,
            "Exceeds max supply"
        );
        _;
    }
    
    modifier validPayment(uint256 quantity) {
        require(msg.value >= MINT_PRICE * quantity, "Insufficient ETH sent");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    constructor(
        address initialOwner,
        address payable _treasuryWallet,
        string memory _hiddenURI
    ) ERC721("CriptoOasis Genesis", "COASIS") Ownable(initialOwner) {
        require(_treasuryWallet != address(0), "Treasury wallet cannot be zero address");
        require(bytes(_hiddenURI).length > 0, "Hidden URI cannot be empty");
        
        treasuryWallet = _treasuryWallet;
        _hiddenMetadataURI = _hiddenURI;
        
        // Começar do token ID 1
        _tokenIdCounter.increment();
    }
    
    // ============ MINTING FUNCTIONS ============
    
    /**
     * @dev Mint NFTs para o usuário
     * @param quantity Quantidade de NFTs para mintar
     */
    function mint(uint256 quantity) 
        external 
        payable 
        nonReentrant 
        mintingIsActive 
        validMintQuantity(quantity)
        validPayment(quantity)
    {
        address to = msg.sender;
        
        // Atualizar contador de mints por wallet
        mintedByWallet[to] += quantity;
        
        // Mintar NFTs
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _safeMint(to, tokenId);
            _tokenIdCounter.increment();
        }
        
        // Transferir fundos automaticamente para a treasury
        (bool success, ) = treasuryWallet.call{value: msg.value}("");
        require(success, "Transfer to treasury failed");
        
        emit NFTMinted(to, _tokenIdCounter.current() - quantity, quantity);
    }
    
    /**
     * @dev Mint reservado para o owner (para marketing, equipe, etc.)
     * @param to Endereço para receber os NFTs
     * @param quantity Quantidade de NFTs para mintar
     */
    function reservedMint(address to, uint256 quantity) 
        external 
        onlyOwner 
        nonReentrant 
    {
        require(to != address(0), "Cannot mint to zero address");
        require(quantity > 0, "Quantity must be greater than 0");
        require(
            _tokenIdCounter.current() + quantity <= MAX_SUPPLY,
            "Exceeds max supply"
        );
        
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _safeMint(to, tokenId);
            _tokenIdCounter.increment();
        }
        
        emit NFTMinted(to, _tokenIdCounter.current() - quantity, quantity);
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Retorna o supply total atual
     */
    function totalSupply() public view override returns (uint256) {
        return _tokenIdCounter.current() - 1;
    }
    
    /**
     * @dev Retorna a quantidade restante para mint
     */
    function remainingSupply() public view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }
    
    /**
     * @dev Verifica se uma carteira pode mintar uma quantidade específica
     * @param wallet Endereço da carteira
     * @param quantity Quantidade desejada
     */
    function canMint(address wallet, uint256 quantity) external view returns (bool) {
        return mintingActive &&
               quantity > 0 &&
               quantity <= MAX_PER_TRANSACTION &&
               mintedByWallet[wallet] + quantity <= MAX_PER_WALLET &&
               totalSupply() + quantity <= MAX_SUPPLY;
    }
    
    /**
     * @dev Retorna a URI do token
     * @param tokenId ID do token
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");
        
        if (!revealed) {
            return _hiddenMetadataURI;
        }
        
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 
            ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json"))
            : "";
    }
    
    /**
     * @dev Retorna a base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Retorna todos os tokens de um owner
     * @param owner Endereço do proprietário
     */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        
        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        
        return tokenIds;
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @dev Alternar status do minting
     */
    function toggleMinting() external onlyOwner {
        mintingActive = !mintingActive;
        emit MintingStatusChanged(mintingActive);
    }
    
    /**
     * @dev Definir base URI para metadados revelados
     * @param newBaseURI Nova base URI
     */
    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIChanged(newBaseURI);
    }
    
    /**
     * @dev Definir URI para metadados ocultos
     * @param newHiddenURI Nova URI oculta
     */
    function setHiddenMetadataURI(string calldata newHiddenURI) external onlyOwner {
        _hiddenMetadataURI = newHiddenURI;
        emit HiddenMetadataURIChanged(newHiddenURI);
    }
    
    /**
     * @dev Revelar metadados
     */
    function reveal() external onlyOwner {
        require(!revealed, "Already revealed");
        require(bytes(_baseTokenURI).length > 0, "Base URI not set");
        revealed = true;
        emit Revealed(true);
    }
    
    /**
     * @dev Função de emergência para retirar fundos
     * (caso algo falhe na transferência automática)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = treasuryWallet.call{value: balance}("");
        require(success, "Emergency withdrawal failed");
        
        emit FundsWithdrawn(treasuryWallet, balance);
    }
    
    /**
     * @dev Função para retirar tokens ERC20 enviados por engano
     * @param token Endereço do token ERC20
     */
    function rescueERC20(address token) external onlyOwner {
        require(token != address(0), "Invalid token address");
        
        IERC20 erc20Token = IERC20(token);
        uint256 balance = erc20Token.balanceOf(address(this));
        require(balance > 0, "No tokens to rescue");
        
        require(erc20Token.transfer(owner(), balance), "Token transfer failed");
    }
    
    // ============ REQUIRED OVERRIDES ============
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    // ============ ROYALTY FUNCTIONS ============
    
    /**
     * @dev Definir royalties (EIP-2981)
     * @param tokenId ID do token
     * @param salePrice Preço de venda
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        returns (address receiver, uint256 royaltyAmount)
    {
        require(_exists(tokenId), "Royalty query for nonexistent token");
        
        // 5% de royalty para a treasury
        uint256 royalty = (salePrice * 500) / 10000;
        return (treasuryWallet, royalty);
    }
}

// Interface para tokens ERC20 (para função de resgate)
interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
}

