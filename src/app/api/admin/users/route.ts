import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import Course from '@/lib/models/Course';
import Project from '@/lib/models/Project';
import { verifyAdminAuth } from '@/lib/auth';

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
    const role = searchParams.get('role');
    const type = searchParams.get('type');
    
    let query: any = {};
    if (role) query.role = role;
    if (type) query.type = type;
    
    const users = await User.find(query, '-password')
      .sort({ _id: -1 })
      .lean();
    
    const usersWithStats = await Promise.all(
      users.map(async (user: any) => {
        const courseCount = await Course.countDocuments({ user: user._id.toString() });
        const projectCount = await Project.countDocuments({ firebaseUId: user.uid });
        
        return {
          ...user,
          stats: {
            courses: courseCount,
            projects: projectCount,
          }
        };
      })
    );
    
    return NextResponse.json({ success: true, users: usersWithStats });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch users",
      error: error.message 
    }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const authCheck = await verifyAdminAuth(req);
  if (!authCheck.isAdmin) {
    return NextResponse.json({ 
      success: false, 
      message: authCheck.error || 'Unauthorized' 
    }, { status: 401 });
  }
  
  await connectDB();
  
  try {
    const { userId, updates } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        message: "User ID is required" 
      }, { status: 400 });
    }
    
    const allowedUpdates = ['role', 'type', 'verified'];
    const filteredUpdates: any = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: filteredUpdates },
      { new: true, select: '-password' }
    );
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: "User not found" 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "User updated successfully",
      user 
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to update user",
      error: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
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
    const userId = searchParams.get('id');
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        message: "User ID is required" 
      }, { status: 400 });
    }
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: "User not found" 
      }, { status: 404 });
    }
    
    await Course.deleteMany({ user: userId });
    await Project.deleteMany({ firebaseUId: user.uid });
    
    return NextResponse.json({ 
      success: true, 
      message: "User and associated data deleted successfully" 
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to delete user",
      error: error.message 
    }, { status: 500 });
  }
}
