import { ethers } from 'ethers';
import { Certificate } from '../types';

// ABI for the Certificate smart contract
// This would be the actual ABI from the deployed contract
const certificateABI = [
  "function issueCertificate(address recipient, string memory ipfsHash, string memory certificateId) public returns (uint256)",
  "function verifyCertificate(uint256 certificateId) public view returns (bool)",
  "function revokeCertificate(uint256 certificateId) public",
  "function getCertificateStatus(uint256 certificateId) public view returns (bool)",
  "event CertificateIssued(address indexed recipient, uint256 indexed certificateId, string ipfsHash)",
  "event CertificateRevoked(uint256 indexed certificateId)"
];

// Contract addresses - would be updated with actual deployed addresses
const CONTRACT_ADDRESSES = {
  testnet: '0x0000000000000000000000000000000000000000', // Replace with actual testnet address
  mainnet: '0x0000000000000000000000000000000000000000', // Replace with actual mainnet address
};

export class CertificateContract {
  private provider: ethers.providers.Web3Provider | null = null;
  private contract: ethers.Contract | null = null;
  private signer: ethers.Signer | null = null;
  private isTestnet: boolean;

  constructor(isTestnet = true) {
    this.isTestnet = isTestnet;
  }

  async connect() {
    if (!window.ethereum) {
      throw new Error('No Ethereum provider found. Please install MetaMask or similar browser extension.');
    }

    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner();
    
    const contractAddress = this.isTestnet ? CONTRACT_ADDRESSES.testnet : CONTRACT_ADDRESSES.mainnet;
    this.contract = new ethers.Contract(contractAddress, certificateABI, this.signer);
    
    return this.contract;
  }

  async issueCertificate(certificate: Certificate): Promise<string> {
    if (!this.contract || !this.signer) {
      await this.connect();
    }

    try {
      const tx = await this.contract!.issueCertificate(
        certificate.recipientWalletAddress,
        certificate.ipfsHash,
        certificate.id
      );
      
      const receipt = await tx.wait();
      
      // Get the transaction hash
      return receipt.transactionHash;
    } catch (error) {
      console.error('Error issuing certificate:', error);
      throw error;
    }
  }

  async verifyCertificate(certificateId: string): Promise<boolean> {
    if (!this.contract) {
      await this.connect();
    }

    try {
      const isValid = await this.contract!.verifyCertificate(certificateId);
      return isValid;
    } catch (error) {
      console.error('Error verifying certificate:', error);
      return false;
    }
  }

  async revokeCertificate(certificateId: string): Promise<string> {
    if (!this.contract || !this.signer) {
      await this.connect();
    }

    try {
      const tx = await this.contract!.revokeCertificate(certificateId);
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      console.error('Error revoking certificate:', error);
      throw error;
    }
  }

  async getCertificateStatus(certificateId: string): Promise<boolean> {
    if (!this.contract) {
      await this.connect();
    }

    try {
      const isValid = await this.contract!.getCertificateStatus(certificateId);
      return isValid;
    } catch (error) {
      console.error('Error getting certificate status:', error);
      return false;
    }
  }

  // For demo or testing purposes: Mock the contract calls
  mockIssueCertificate(): string {
    // Return a fake transaction hash
    return `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  }

  mockVerifyCertificate(): boolean {
    // Random verification with 90% success rate
    return Math.random() < 0.9;
  }
}

// Export a singleton instance for the app to use
export const certificateContract = new CertificateContract(true);