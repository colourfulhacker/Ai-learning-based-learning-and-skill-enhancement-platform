import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import User from './models/User';
import connectDB from './db';

interface JWTPayload {
  userId: string;
  uid: string;
}

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set. The application cannot run securely without it.');
}

const JWT_SECRET = process.env.JWT_SECRET;

export async function verifyAdminAuth(request: NextRequest): Promise<{ isAdmin: boolean; userId?: string; error?: string }> {
  try {
    const token = request.cookies.get('jwt');
    
    if (!token) {
      return { isAdmin: false, error: 'No authentication token found' };
    }

    const decoded = jwt.verify(token.value, JWT_SECRET) as JWTPayload;
    
    await connectDB();
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return { isAdmin: false, error: 'User not found' };
    }
    
    if (user.role !== 'admin') {
      return { isAdmin: false, error: 'Unauthorized: Admin access required' };
    }
    
    return { isAdmin: true, userId: decoded.userId };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { isAdmin: false, error: 'Invalid or expired token' };
  }
}

export async function verifyAuth(request: NextRequest): Promise<{ authenticated: boolean; userId?: string; uid?: string; error?: string }> {
  try {
    const token = request.cookies.get('jwt');
    
    if (!token) {
      return { authenticated: false, error: 'No authentication token found' };
    }

    const decoded = jwt.verify(token.value, JWT_SECRET) as JWTPayload;
    
    await connectDB();
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return { authenticated: false, error: 'User not found' };
    }
    
    return { authenticated: true, userId: decoded.userId, uid: decoded.uid };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { authenticated: false, error: 'Invalid or expired token' };
  }
}
