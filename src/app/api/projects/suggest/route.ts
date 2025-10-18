import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/lib/models/Course';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { courseId } = await req.json();
    
    if (!courseId) {
      return NextResponse.json({ success: false, message: "Course ID is required" }, { status: 400 });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
    }

    const courseLang = course.lang || 'English';
    const mainTopic = course.mainTopic;
    const content = JSON.parse(course.content);
    
    const mainTopicKey = Object.keys(content)[0] || mainTopic.toLowerCase();
    const topics = content[mainTopicKey] || [];
    const topicTitles = topics.map((t: any) => t.title).join(', ');
    
    const languageInstruction = courseLang.toLowerCase() !== 'english' 
      ? `\n\nIMPORTANT: Generate all project details in ${courseLang}.`
      : '';

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `You are a project advisor helping students apply their knowledge of "${mainTopic}".
    The course covers: ${topicTitles}.${languageInstruction}

    Generate a JSON array of 5 project suggestions that allow students to practice what they learned.
    Each project should have:
    - title: A clear, engaging project title
    - description: A detailed 2-3 sentence description of what they'll build
    - difficulty: One of "Beginner", "Intermediate", or "Advanced"
    - time: Estimated completion time (e.g., "2-3 hours", "1 week")
    - skills: Array of 3-5 key skills they'll practice

    Make the projects:
    1. Progressively challenging (start easy, end advanced)
    2. Practical and useful (real-world applications)
    3. Diverse (cover different aspects of the course)
    4. Achievable for students at different skill levels

    Return ONLY a valid JSON array, no additional text. Format:
    [
      {
        "title": "Project Title",
        "description": "What they'll build...",
        "difficulty": "Beginner",
        "time": "2-3 hours",
        "skills": ["Skill 1", "Skill 2", "Skill 3"]
      }
    ]`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse project suggestions from AI response");
    }
    
    const projects = JSON.parse(jsonMatch[0]);
    
    if (!Array.isArray(projects) || projects.length === 0) {
      throw new Error("Invalid project suggestions format");
    }

    return NextResponse.json({ 
      success: true, 
      projects,
      courseTitle: mainTopic
    });

  } catch (error: any) {
    console.error("Error generating project suggestions:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to generate project suggestions",
      error: error.message 
    }, { status: 500 });
  }
}
