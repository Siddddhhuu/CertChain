import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ethers } from "ethers";
import { Web3State } from "../types";

interface Web3ContextProps {
  web3State: Web3State;
  connect: () => Promise<void>;
  disconnect: () => void;
  isXDCNetwork: boolean;
  switchToXDCNetwork: () => Promise<void>;
}

const XDC_TESTNET_PARAMS = {
  chainId: "0x33",
  chainName: "XDC Apothem Network",
  nativeCurrency: {
    name: "TXDC",
    symbol: "TXDC",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.apothem.network"],
  blockExplorerUrls: ["https://explorer.apothem.network/"],
};

const Web3Context = createContext<Web3ContextProps | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [web3State, setWeb3State] = useState<Web3State>({
    isConnected: false,
    account: null,
    chainId: null,
    isLoading: false,
    error: null,
  });

  const connect = async () => {
    try {
      setWeb3State((prev) => ({ ...prev, isLoading: true, error: null }));

      if (!window.ethereum) {
        throw new Error("No Ethereum browser extension detected");
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Get current chain ID
      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      setWeb3State({
        isConnected: true,
        account: accounts[0],
        chainId: parseInt(chainId, 16),
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      setWeb3State({
        isConnected: false,
        account: null,
        chainId: null,
        isLoading: false,
        error: "Failed to connect wallet",
      });
    }
  };

  const disconnect = () => {
    setWeb3State({
      isConnected: false,
      account: null,
      chainId: null,
      isLoading: false,
      error: null,
    });
  };

  const switchToXDCNetwork = async () => {
    if (!window.ethereum) return;

    try {
      // Try to switch to the XDC network
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: XDC_TESTNET_PARAMS.chainId }],
      });
    } catch (switchError: any) {
      // If the network is not added to MetaMask, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [XDC_TESTNET_PARAMS],
          });
        } catch (addError) {
          console.error("Error adding XDC network:", addError);
        }
      }
    }
  };

  useEffect(() => {
    // Check if already connected
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            window.ethereum
              .request({ method: "eth_chainId" })
              .then((chainId: string) => {
                setWeb3State({
                  isConnected: true,
                  account: accounts[0],
                  chainId: parseInt(chainId, 16),
                  isLoading: false,
                  error: null,
                });
              });
          }
        })
        .catch(console.error);

      // Set up event listeners
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected all accounts
          disconnect();
        } else {
          setWeb3State((prev) => ({
            ...prev,
            account: accounts[0],
          }));
        }
      });

      window.ethereum.on("chainChanged", (chainId: string) => {
        setWeb3State((prev) => ({
          ...prev,
          chainId: parseInt(chainId, 16),
        }));
      });

      return () => {
        // Remove event listeners when component unmounts
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      };
    }
  }, []);

  // Check if connected to XDC network
  const isXDCNetwork = web3State.chainId === parseInt(XDC_TESTNET_PARAMS.chainId, 16);

  return (
    <Web3Context.Provider
      value={{
        web3State,
        connect,
        disconnect,
        isXDCNetwork,
        switchToXDCNetwork,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  
  return context;
};