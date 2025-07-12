
import React, { useState, useContext } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { AppContext } from '../context/AppContext';
import { generateExplanation } from '../services/aiService';

const Introduction: React.FC = () => {
    const { apiSettings } = useContext(AppContext);
    const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        const newHistory = [...chatHistory, { role: 'user' as const, content: userInput }];
        setChatHistory(newHistory);
        setUserInput('');
        setIsLoading(true);

        try {
            const aiResponse = await generateExplanation(userInput, apiSettings);
            setChatHistory(prev => [...prev, { role: 'assistant' as const, content: aiResponse }]);
        } catch (error) {
            setChatHistory(prev => [...prev, { role: 'assistant' as const, content: 'Sorry, I encountered an error.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-white">Introduction to Machine Learning</h1>
            
            <Card>
                <h2 className="text-2xl font-semibold text-blue-400 mb-3">What is Machine Learning?</h2>
                <p className="text-gray-300 leading-relaxed">
                    Machine Learning (ML) is a field of artificial intelligence (AI) that focuses on building computer systems that can learn from data. Instead of being explicitly programmed to perform a task, these systems use algorithms to find patterns in data and make predictions or decisions.
                </p>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <h2 className="text-2xl font-semibold text-blue-400 mb-3">Supervised Learning</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        In supervised learning, the algorithm learns from a labeled dataset, meaning each data point is tagged with a correct output or label. The goal is to learn a mapping function that can predict the output for new, unseen data.
                    </p>
                    <h3 className="font-semibold text-lg text-gray-200 mb-2">Key Concepts:</h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                        <li><strong>Classification:</strong> Predicting a category (e.g., spam or not spam).</li>
                        <li><strong>Regression:</strong> Predicting a continuous value (e.g., house price).</li>
                        <li><strong>Features:</strong> The input variables used for prediction.</li>
                        <li><strong>Labels:</strong> The correct output for a given input.</li>
                    </ul>
                </Card>
                <Card>
                    <h2 className="text-2xl font-semibold text-blue-400 mb-3">Unsupervised Learning</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        In unsupervised learning, the algorithm works with unlabeled data. The system tries to learn the patterns and structure from the data without any explicit guidance or correct answers.
                    </p>
                     <h3 className="font-semibold text-lg text-gray-200 mb-2">Key Concepts:</h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                        <li><strong>Clustering:</strong> Grouping similar data points together (e.g., customer segmentation).</li>
                        <li><strong>Association:</strong> Discovering rules that describe large portions of your data (e.g., market basket analysis).</li>
                    </ul>
                </Card>
            </div>

            <Card>
                <h2 className="text-2xl font-semibold text-blue-400 mb-4">Ask the AI Tutor</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 mb-4">
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700'}`}>
                                <p>{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex justify-start">
                             <div className="p-3 rounded-lg bg-gray-700">
                                 <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                             </div>
                         </div>
                    )}
                </div>
                <form onSubmit={handleChatSubmit} className="flex gap-4">
                    <Input 
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask a question about ML basics..."
                        disabled={isLoading}
                    />
                    <Button type="submit" isLoading={isLoading}>Send</Button>
                </form>
            </Card>

        </div>
    );
};

export default Introduction;
