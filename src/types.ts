export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  walletAddress?: string;
  phoneNumber?: string;
  address?: string;
  profilePictureUrl?: string;
  createdAt: string;
  updatedAt: string;
  certificatesCount?: number;
} 