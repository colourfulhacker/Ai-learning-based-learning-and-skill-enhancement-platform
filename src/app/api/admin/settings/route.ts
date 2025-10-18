import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';
import { verifyAdminAuth } from '@/lib/auth';

const SETTINGS_DIR = path.join(process.cwd(), 'content');

async function ensureDir() {
  try {
    await fs.access(SETTINGS_DIR);
  } catch {
    await fs.mkdir(SETTINGS_DIR, { recursive: true });
  }
}

export async function GET(req: NextRequest) {
  const authCheck = await verifyAdminAuth(req);
  if (!authCheck.isAdmin) {
    return NextResponse.json({ 
      success: false, 
      message: authCheck.error || 'Unauthorized' 
    }, { status: 401 });
  }
  
  await connectDB();
  
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    
    if (!type || !['terms', 'privacy'].includes(type)) {
      return NextResponse.json({ 
        success: false, 
        message: "Valid type (terms or privacy) is required" 
      }, { status: 400 });
    }
    
    await ensureDir();
    const filePath = path.join(SETTINGS_DIR, `${type}.txt`);
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return NextResponse.json({ success: true, content });
    } catch (error) {
      return NextResponse.json({ success: true, content: '' });
    }
  } catch (error: any) {
    console.error('Error reading content:', error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to read content",
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authCheck = await verifyAdminAuth(req);
  if (!authCheck.isAdmin) {
    return NextResponse.json({ 
      success: false, 
      message: authCheck.error || 'Unauthorized' 
    }, { status: 401 });
  }
  
  await connectDB();
  
  try {
    const { type, content } = await req.json();
    
    if (!type || !['terms', 'privacy'].includes(type)) {
      return NextResponse.json({ 
        success: false, 
        message: "Valid type (terms or privacy) is required" 
      }, { status: 400 });
    }
    
    if (content === undefined || content === null) {
      return NextResponse.json({ 
        success: false, 
        message: "Content is required" 
      }, { status: 400 });
    }
    
    await ensureDir();
    const filePath = path.join(SETTINGS_DIR, `${type}.txt`);
    await fs.writeFile(filePath, content, 'utf-8');
    
    return NextResponse.json({ 
      success: true, 
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully` 
    });
  } catch (error: any) {
    console.error('Error writing content:', error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to save content",
      error: error.message 
    }, { status: 500 });
  }
}
