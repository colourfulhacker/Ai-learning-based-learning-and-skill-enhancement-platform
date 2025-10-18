import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/lib/models/Course';
import User from '@/lib/models/User';
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
    const completed = searchParams.get('completed');
    
    let query: any = {};
    if (completed !== null && completed !== undefined && completed !== '') {
      query.completed = completed === 'true';
    }
    
    const courses = await Course.find(query)
      .sort({ date: -1 })
      .lean();
    
    const coursesWithUserInfo = await Promise.all(
      courses.map(async (course) => {
        const user = await User.findById(course.user, 'email mName');
        return {
          ...course,
          userInfo: user || { email: 'Unknown', mName: 'Unknown' }
        };
      })
    );
    
    return NextResponse.json({ success: true, courses: coursesWithUserInfo });
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch courses",
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
    const courseId = searchParams.get('id');
    
    if (!courseId) {
      return NextResponse.json({ 
        success: false, 
        message: "Course ID is required" 
      }, { status: 400 });
    }
    
    const course = await Course.findByIdAndDelete(courseId);
    
    if (!course) {
      return NextResponse.json({ 
        success: false, 
        message: "Course not found" 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Course deleted successfully" 
    });
  } catch (error: any) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to delete course",
      error: error.message 
    }, { status: 500 });
  }
}
