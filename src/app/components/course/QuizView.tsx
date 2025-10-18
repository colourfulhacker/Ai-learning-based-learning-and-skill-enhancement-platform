'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';
import { AiOutlineLoading } from 'react-icons/ai';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizViewProps {
  courseId: string;
  courseTitle: string;
  userId: string;
}

const QuizView: React.FC<QuizViewProps> = ({ courseId, courseTitle, userId }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const generateQuiz = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.post('/api/quiz/generate', { courseId });
        const data = response.data as { success: boolean; questions: QuizQuestion[] };
        if (data.success) {
          setQuestions(data.questions);
        } else {
          toast.error('Failed to generate quiz');
        }
      } catch (error: any) {
        console.error('Error generating quiz:', error);
        toast.error('Failed to load quiz questions');
      } finally {
        setLoading(false);
      }
    };

    generateQuiz();
  }, [courseId]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showExplanation) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      toast.warning('Please select an answer');
      return;
    }

    const newUserAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newUserAnswers);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      calculateAndSaveScore();
    }
  };

  const calculateAndSaveScore = async () => {
    const finalAnswers = [...userAnswers, selectedAnswer!];
    let correctCount = 0;
    
    questions.forEach((question, index) => {
      if (question.correctAnswer === finalAnswers[index]) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setQuizComplete(true);

    try {
      await axiosInstance.post('/api/quiz-results', {
        userId,
        courseId,
        score: finalScore
      });
    } catch (error) {
      console.error('Error saving quiz score:', error);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setShowExplanation(false);
    setQuizComplete(false);
    setScore(0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <AiOutlineLoading className="h-8 w-8 animate-spin text-black dark:text-white" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-black dark:text-white">Failed to load quiz questions. Please try again later.</p>
      </div>
    );
  }

  if (quizComplete) {
    const correctCount = questions.filter((q, i) => q.correctAnswer === userAnswers[i]).length;
    
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">Quiz Complete!</h2>
          <div className="my-8">
            <div className="text-6xl font-black mb-4" style={{ color: score >= 70 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444' }}>
              {score}%
            </div>
            <p className="text-xl text-black dark:text-white">
              You got {correctCount} out of {questions.length} questions correct
            </p>
          </div>
          
          {score >= 70 && (
            <p className="text-lg text-green-600 dark:text-green-400 mb-6">Excellent work! You've mastered this material!</p>
          )}
          {score >= 50 && score < 70 && (
            <p className="text-lg text-yellow-600 dark:text-yellow-400 mb-6">Good job! Consider reviewing the course material.</p>
          )}
          {score < 50 && (
            <p className="text-lg text-red-600 dark:text-red-400 mb-6">Keep practicing! Review the course content and try again.</p>
          )}

          <button
            onClick={restartQuiz}
            className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-lg font-bold hover:opacity-80 transition"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-black dark:text-white">Quiz: {courseTitle}</h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-black dark:bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-bold mb-6 text-black dark:text-white">{currentQuestion.question}</h3>

        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const showCorrect = showExplanation && index === currentQuestion.correctAnswer;
            const showWrong = showExplanation && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  showCorrect
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : showWrong
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : isSelected
                    ? 'border-black dark:border-white bg-gray-100 dark:bg-gray-700'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold
                    ${showCorrect ? 'bg-green-500 text-white' : showWrong ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-black dark:text-white'}">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-black dark:text-white">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className={`p-4 rounded-lg mb-6 ${
            isCorrect ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 
            'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <p className={`font-bold mb-2 ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            <p className="text-black dark:text-white">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="flex justify-end">
          {!showExplanation ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-lg font-bold disabled:opacity-50 hover:opacity-80 transition"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-lg font-bold hover:opacity-80 transition"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizView;
