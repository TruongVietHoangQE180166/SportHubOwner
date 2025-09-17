import { AuthUser } from '../types';

export const mockUsers: AuthUser[] = [
  {
    id: '1',
    email: 'admin@santhethao.com',
    password: 'admin123', 
    role: 'admin',
    isActive: true,
  },
  {
    id: '2',
    email: 'an.nguyen@example.com',
    password: 'password123',
    role: 'owner',
    isActive: true,
  },
  {
    id: '3',
    email: 'demo@santhethao.com',
    password: 'demo123',
    role: 'user',
    isActive: true,
  }
];