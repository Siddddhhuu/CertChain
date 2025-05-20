import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWeb3 } from '../../contexts/Web3Context';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../../components/common/Card';
import { Wallet, ExternalLink, RefreshCw, Send, Download, Upload, Copy, AlertTriangle } from 'lucide-react';

interface Transaction {
  hash: string;
  type: 'send' | 'receive';
  amount: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  from: string;
  to: string;
}

const WalletPage: React.FC = () => {
  const { authState } = useAuth();
  const { web3State, connect, disconnect } = useWeb3();
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadWalletData = async () => {
      try {
        setIsLoading(true);
        // In a real app, these would be actual blockchain calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setBalance('1000.50');
        setRecentTransactions([
          {
            hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            type: 'receive',
            amount: '500.00',
            timestamp: new Date('2024-02-15T10:30:00'),
            status: 'confirmed',
            from: '0xabcdef1234567890abcdef1234567890abcdef12',
            to: web3State.account || '0x0000000000000000000000000000000000000000'
          },
          {
            hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
            type: 'send',
            amount: '100.00',
            timestamp: new Date('2024-02-14T15:45:00'),
            status: 'confirmed',
            from: web3State.account || '0x0000000000000000000000000000000000000000',
            to: '0x1234567890abcdef1234567890abcdef12345678'
          }
        ]);
      } catch (error) {
        console.error('Error loading wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (web3State.isConnected) {
      loadWalletData();
    }
  }, [web3State.isConnected, web3State.account]);

  const handleConnectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const handleDisconnectWallet = () => {
    disconnect();
  };

  const handleCopyAddress = () => {
    if (web3State.account) {
      navigator.clipboard.writeText(web3State.account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleViewOnExplorer = () => {
    if (web3State.account) {
      window.open(`https://explorer.apothem.network/address/${web3State.account}`, '_blank');
    }
  };

  const handleRefreshBalance = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch the latest balance
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBalance('1000.50');
    } catch (error) {
      console.error('Error refreshing balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!web3State.isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Wallet className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Wallet Not Connected</h3>
          <p className="mt-1 text-sm text-gray-500">Connect your XDC wallet to manage certificates.</p>
          <div className="mt-6">
            <Button
              variant="primary"
              onClick={handleConnectWallet}
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            XDC Wallet
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your blockchain wallet and gas funds
          </p>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row sm:mt-0 sm:ml-4 space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            variant="outline"
            leftIcon={<RefreshCw className="h-5 w-5" />}
            onClick={handleRefreshBalance}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Refresh
          </Button>
          <Button
            variant="danger"
            onClick={handleDisconnectWallet}
            className="w-full sm:w-auto"
          >
            Disconnect
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Balance Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {isLoading ? (
                  <div className="animate-pulse">...</div>
                ) : (
                  `${balance} XDC`
                )}
              </div>
              <p className="text-sm text-gray-500">Available for gas fees</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              variant="primary"
              leftIcon={<Send className="h-5 w-5" />}
              onClick={() => setShowSendModal(true)}
              className="w-full sm:w-auto"
            >
              Send
            </Button>
            <Button
              variant="outline"
              leftIcon={<Download className="h-5 w-5" />}
              className="w-full sm:w-auto"
            >
              Receive
            </Button>
          </CardFooter>
        </Card>

        {/* Wallet Address Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Wallet Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-4 rounded-lg space-y-2 sm:space-y-0">
              <code className="text-sm text-gray-600 font-mono break-all">
                {web3State.account}
              </code>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Copy className="h-4 w-4" />}
                  onClick={handleCopyAddress}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<ExternalLink className="h-4 w-4" />}
                  onClick={handleViewOnExplorer}
                >
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : recentTransactions.length > 0 ? (
            <ul role="list" className="divide-y divide-gray-200">
              {recentTransactions.map((tx) => (
                <li key={tx.hash} className="px-4 py-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        tx.type === 'receive' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {tx.type === 'receive' ? (
                          <Download className="h-4 w-4 text-green-600" />
                        ) : (
                          <Upload className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {tx.type === 'receive' ? 'Received' : 'Sent'} {tx.amount} XDC
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(tx.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        tx.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : tx.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.status}
                      </span>
                      <button
                        onClick={() => window.open(`https://explorer.apothem.network/tx/${tx.hash}`, '_blank')}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">No recent transactions</p>
            </div>
          )}
        </div>
      </div>

      {/* Gas Fee Warning */}
      <div className="mt-8">
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex flex-col sm:flex-row">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-0 sm:ml-3 mt-2 sm:mt-0">
              <h3 className="text-sm font-medium text-yellow-800">Gas Fee Notice</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Make sure to maintain sufficient XDC in your wallet for gas fees. 
                  Each certificate issuance requires a small amount of XDC for the blockchain transaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage; 