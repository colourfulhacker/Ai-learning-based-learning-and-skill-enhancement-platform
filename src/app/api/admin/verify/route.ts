import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const authCheck = await verifyAdminAuth(req);
  
  if (!authCheck.isAdmin) {
    return NextResponse.json({ 
      success: false, 
      message: authCheck.error || 'Unauthorized' 
    }, { status: 401 });
  }
  
  return NextResponse.json({ 
    success: true, 
    message: 'Admin authenticated' 
  });
}
