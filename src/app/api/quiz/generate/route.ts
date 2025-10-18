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
      ? `\n\nIMPORTANT: Generate all quiz content in ${courseLang}.`
      : '';

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `You are creating a comprehensive quiz for a course on "${mainTopic}".
    The course covers these topics: ${topicTitles}.${languageInstruction}

    Generate a JSON array of 10 multiple-choice questions that test understanding of the course material.
    Each question should have:
    - question: The question text
    - options: An array of 4 possible answers (strings)
    - correctAnswer: The index (0-3) of the correct option
    - explanation: A brief explanation of why the correct answer is right

    Make the questions:
    1. Progressive in difficulty (start easy, get harder)
    2. Cover different topics from the course
    3. Test both conceptual understanding and practical application
    4. Have plausible distractors (wrong answers that might seem correct)

    Return ONLY a valid JSON array, no additional text. Format:
    [
      {
        "question": "What is...",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "explanation": "Explanation here..."
      }
    ]`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse quiz questions from AI response");
    }
    
    const questions = JSON.parse(jsonMatch[0]);
    
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Invalid quiz questions format");
    }

    return NextResponse.json({ 
      success: true, 
      questions,
      courseTitle: mainTopic,
      courseLang
    });

  } catch (error: any) {
    console.error("Error generating quiz:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to generate quiz questions",
      error: error.message 
    }, { status: 500 });
  }
}
