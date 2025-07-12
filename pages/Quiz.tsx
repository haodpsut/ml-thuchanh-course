import React, { useState, useContext } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { AppContext } from '../context/AppContext';
import { generateExplanation } from '../services/aiService';

const Quiz: React.FC = () => {
    const { apiSettings } = useContext(AppContext);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [explanation, setExplanation] = useState<string | null>(null);
    const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

    const handleAnswerSelect = (optionIndex: number) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setSelectedAnswers(newAnswers);
    };

    const handleNext = () => {
        setExplanation(null);
        if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResults(true);
        }
    };

    const handleReset = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setShowResults(false);
        setExplanation(null);
    };

    const handleExplain = async (questionIndex: number) => {
        setIsLoadingExplanation(true);
        const question = QUIZ_QUESTIONS[questionIndex];
        const userAnswer = question.options[selectedAnswers[questionIndex]];
        const correctAnswer = question.options[question.correctAnswerIndex];

        const prompt = `A student is reviewing a quiz.
        Question: "${question.question}"
        Their answer was: "${userAnswer}"
        The correct answer is: "${correctAnswer}"
        
        Please explain why the correct answer is right and, if their answer was wrong, why it was incorrect. Keep the explanation clear and educational.`;

        try {
            const response = await generateExplanation(prompt, apiSettings);
            setExplanation(response);
        } catch (error) {
            setExplanation("Failed to get explanation.");
        } finally {
            setIsLoadingExplanation(false);
        }
    };

    if (showResults) {
        const score = selectedAnswers.filter((answer, index) => answer === QUIZ_QUESTIONS[index].correctAnswerIndex).length;
        return (
            <Card className="text-center">
                <h1 className="text-3xl font-bold mb-4">Quiz Results</h1>
                <p className="text-5xl font-bold text-teal-400 mb-4">{score} / {QUIZ_QUESTIONS.length}</p>
                <p className="text-xl mb-6">You scored {((score / QUIZ_QUESTIONS.length) * 100).toFixed(0)}%</p>
                <div className="text-left space-y-4 mb-6">
                    {QUIZ_QUESTIONS.map((q, i) => (
                        <div key={i} className="p-3 bg-gray-700 rounded-md">
                            <p className="font-semibold">{i+1}. {q.question}</p>
                            <p className={`mt-1 ${selectedAnswers[i] === q.correctAnswerIndex ? 'text-green-400' : 'text-red-400'}`}>
                                Your answer: {q.options[selectedAnswers[i]]}
                            </p>
                            {selectedAnswers[i] !== q.correctAnswerIndex && <p className="text-gray-300">Correct answer: {q.options[q.correctAnswerIndex]}</p>}
                            <Button variant="secondary" onClick={() => handleExplain(i)} className="mt-2 text-xs py-1 px-2">Explain</Button>
                        </div>
                    ))}
                </div>
                {isLoadingExplanation && <p>Loading explanation...</p>}
                {explanation && <Card className="mt-4 text-left"><div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br />') }}></div></Card>}
                <Button onClick={handleReset} className="mt-6">Try Again</Button>
            </Card>
        );
    }

    const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-6 text-center">ML Knowledge Quiz</h1>
            <Card>
                <p className="text-gray-400 mb-2">Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}</p>
                <h2 className="text-2xl font-semibold mb-6">{currentQuestion.question}</h2>
                <div className="space-y-4">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            className={`w-full text-left p-4 rounded-md border-2 transition-colors ${selectedAnswers[currentQuestionIndex] === index
                                    ? 'bg-blue-600 border-blue-500'
                                    : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                <div className="mt-8 text-right">
                    <Button
                        onClick={handleNext}
                        disabled={selectedAnswers[currentQuestionIndex] === undefined}
                    >
                        {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? 'Next' : 'Finish Quiz'}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default Quiz;