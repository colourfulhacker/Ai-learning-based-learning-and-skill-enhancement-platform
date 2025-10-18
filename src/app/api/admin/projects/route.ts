import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
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
    const status = searchParams.get('status');
    
    let query: any = {};
    if (status && ['pending', 'accepted', 'rejected'].includes(status)) {
      query.approve = status;
    }
    
    const projects = await Project.find(query)
      .sort({ dateCreated: -1 })
      .lean();
    
    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch projects",
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
    const { projectId, approve } = await req.json();
    
    if (!projectId || !approve) {
      return NextResponse.json({ 
        success: false, 
        message: "Project ID and approval status are required" 
      }, { status: 400 });
    }
    
    if (!['pending', 'accepted', 'rejected'].includes(approve)) {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid approval status" 
      }, { status: 400 });
    }
    
    const project = await Project.findByIdAndUpdate(
      projectId,
      { approve },
      { new: true }
    );
    
    if (!project) {
      return NextResponse.json({ 
        success: false, 
        message: "Project not found" 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Project ${approve}`,
      project 
    });
  } catch (error: any) {
    console.error("Error updating project:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to update project",
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
    const projectId = searchParams.get('id');
    
    if (!projectId) {
      return NextResponse.json({ 
        success: false, 
        message: "Project ID is required" 
      }, { status: 400 });
    }
    
    const project = await Project.findByIdAndDelete(projectId);
    
    if (!project) {
      return NextResponse.json({ 
        success: false, 
        message: "Project not found" 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Project deleted successfully" 
    });
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to delete project",
      error: error.message 
    }, { status: 500 });
  }
}
