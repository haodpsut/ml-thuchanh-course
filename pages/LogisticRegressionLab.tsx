
import React, { useState, useMemo, useContext } from 'react';
import { LogisticRegression, calculateAccuracy, calculateConfusionMatrix, trainTestSplit } from '../lib/ml';
import { IRIS_DATASET } from '../constants';
import { ConfusionMatrix } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { AppContext } from '../context/AppContext';
import { generateExplanation } from '../services/aiService';

const LogisticRegressionLab: React.FC = () => {
    const { apiSettings } = useContext(AppContext);
    const [learningRate, setLearningRate] = useState(0.1);
    const [epochs, setEpochs] = useState(100);
    const [results, setResults] = useState<{ accuracy: number; confusionMatrix: ConfusionMatrix } | null>(null);

    const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
    const [explanation, setExplanation] = useState('');

    const { X_train, y_train, X_test, y_test } = useMemo(() => {
        return trainTestSplit(IRIS_DATASET.features, IRIS_DATASET.labels, 0.3);
    }, []);

    const handleTrain = () => {
        const model = new LogisticRegression();
        model.train(X_train, y_train, learningRate, epochs);
        
        const y_pred = X_test.map(x => model.predict(x));
        const accuracy = calculateAccuracy(y_test, y_pred);
        const confusionMatrix = calculateConfusionMatrix(y_test, y_pred);
        
        setResults({ accuracy, confusionMatrix });
        setExplanation('');
    };

    const handleExplain = async () => {
        if (!results) return;
        setIsLoadingExplanation(true);
        const prompt = `Explain this logistic regression result for a student.
        - Accuracy: ${results.accuracy.toFixed(2)}%
        - Confusion Matrix:
          - True Negatives (TN): ${results.confusionMatrix[0][0]}
          - False Positives (FP): ${results.confusionMatrix[0][1]}
          - False Negatives (FN): ${results.confusionMatrix[1][0]}
          - True Positives (TP): ${results.confusionMatrix[1][1]}
        What does this confusion matrix tell us about the model's performance on the two classes?`;
        
        try {
            const response = await generateExplanation(prompt, apiSettings);
            setExplanation(response);
        } catch (error) {
            setExplanation("Failed to get explanation.");
        } finally {
            setIsLoadingExplanation(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white">Lab: Logistic Regression</h1>
            <p className="text-gray-400">Dataset: A small sample of the Iris dataset, classifying between two species based on sepal dimensions.</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <h2 className="text-xl font-semibold mb-4 text-blue-400">Hyperparameters</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Learning Rate: {learningRate}</label>
                            <input type="range" min="0.01" max="1" step="0.01" value={learningRate} onChange={e => setLearningRate(parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Epochs: {epochs}</label>
                            <input type="range" min="50" max="1000" step="10" value={epochs} onChange={e => setEpochs(parseInt(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        <Button onClick={handleTrain} className="w-full">Train Model</Button>
                    </div>
                </Card>

                <Card className="lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4 text-blue-400">Results</h2>
                    {results ? (
                        <div className="space-y-4">
                            <div className="text-center">
                                <p className="text-lg">Accuracy</p>
                                <p className="text-4xl font-bold text-teal-400">{results.accuracy.toFixed(2)}%</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-center">Confusion Matrix</h3>
                                <div className="flex justify-center">
                                    <table>
                                        <tbody>
                                            <tr><td></td><td className="font-bold p-2 text-center">Predicted 0</td><td className="font-bold p-2 text-center">Predicted 1</td></tr>
                                            <tr>
                                                <td className="font-bold p-2 text-right">Actual 0</td>
                                                <td className="bg-green-800 p-4 text-center text-xl">{results.confusionMatrix[0][0]}</td>
                                                <td className="bg-red-800 p-4 text-center text-xl">{results.confusionMatrix[0][1]}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold p-2 text-right">Actual 1</td>
                                                <td className="bg-red-800 p-4 text-center text-xl">{results.confusionMatrix[1][0]}</td>
                                                <td className="bg-green-800 p-4 text-center text-xl">{results.confusionMatrix[1][1]}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="text-xs text-gray-400 text-center mt-2">
                                    <p>TN: {results.confusionMatrix[0][0]}, FP: {results.confusionMatrix[0][1]}</p>
                                    <p>FN: {results.confusionMatrix[1][0]}, TP: {results.confusionMatrix[1][1]}</p>
                                </div>
                            </div>
                            <div className="text-center">
                                <Button onClick={handleExplain} isLoading={isLoadingExplanation} className="mt-4">Explain Results</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400">
                            <p>Train the model to see the results.</p>
                        </div>
                    )}
                </Card>
            </div>
             {explanation && (
                <Card>
                    <h3 className="text-xl font-semibold text-blue-400 mb-2">AI Explanation</h3>
                    <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br />') }}></div>
                </Card>
            )}
        </div>
    );
};

export default LogisticRegressionLab;
