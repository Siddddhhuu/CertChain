export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  walletAddress?: string;
}

export interface Certificate {
  id: string;
  recipientName: string;
  recipientEmail: string;
  recipientWalletAddress: string;
  institutionName: string;
  institutionId: string;
  title: string;
  description: string;
  issuedOn: Date;
  expiresOn?: Date;
  credentialId: string;
  transactionHash?: string;
  ipfsHash?: string;
  status: "issued" | "revoked" | "expired";
  metadata: Record<string, any>;
  verificationCode: string;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  institutionId: string;
  fields: TemplateField[];
  design: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    logoUrl?: string;
  };
}

export interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: "text" | "date" | "select" | "checkbox";
  required: boolean;
  options?: string[];
}

export interface Institution {
  id: string;
  name: string;
  address: string;
  website: string;
  email: string;
  phone: string;
  walletAddress: string;
  verified: boolean;
  logoUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Web3State {
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  isLoading: boolean;
  error: string | null;
}