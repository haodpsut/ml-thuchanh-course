
import React, { useState, useMemo, useContext } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { LinearRegression, trainTestSplit } from '../lib/ml';
import { LINEAR_DATASET } from '../constants';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { AppContext } from '../context/AppContext';
import { generateExplanation } from '../services/aiService';

const LinearRegressionLab: React.FC = () => {
    const { apiSettings } = useContext(AppContext);
    const [learningRate, setLearningRate] = useState(0.01);
    const [epochs, setEpochs] = useState(100);
    const [testSize, setTestSize] = useState(0.3);
    const [modelParams, setModelParams] = useState<{ slope: number; intercept: number } | null>(null);
    const [results, setResults] = useState<{ mse: number; data: any[] } | null>(null);

    const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
    const [explanation, setExplanation] = useState('');

    const { X_train, y_train, X_test, y_test } = useMemo(() => {
        return trainTestSplit(LINEAR_DATASET.features, LINEAR_DATASET.labels, testSize);
    }, [testSize]);

    const handleTrain = () => {
        const model = new LinearRegression();
        model.train(X_train, y_train, learningRate, epochs);
        setModelParams(model.getParams());

        let mse = 0;
        const predictions = X_test.map(x => model.predict(x[0]));
        for (let i = 0; i < y_test.length; i++) {
            mse += Math.pow(y_test[i] - predictions[i], 2);
        }
        mse /= y_test.length;
        
        const combinedData = LINEAR_DATASET.features.map((x, i) => ({ x: x[0], y: LINEAR_DATASET.labels[i] }));
        setResults({ mse, data: combinedData });
        setExplanation('');
    };
    
    const handleExplain = async () => {
        if (!results || !modelParams) return;
        setIsLoadingExplanation(true);
        const prompt = `Explain these linear regression results for a student.
        - Slope: ${modelParams.slope.toFixed(4)}
        - Intercept: ${modelParams.intercept.toFixed(4)}
        - Mean Squared Error (MSE) on test data: ${results.mse.toFixed(4)}
        What do these values mean in the context of the model trying to find a line of best fit?`;
        
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
            <h1 className="text-4xl font-bold text-white">Lab: Linear Regression</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <h2 className="text-xl font-semibold mb-4 text-blue-400">Hyperparameters</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Learning Rate: {learningRate}</label>
                            <input type="range" min="0.001" max="0.1" step="0.001" value={learningRate} onChange={e => setLearningRate(parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Epochs: {epochs}</label>
                            <input type="range" min="10" max="1000" step="10" value={epochs} onChange={e => setEpochs(parseInt(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-1">Test Split: {testSize.toFixed(2)}</label>
                            <input type="range" min="0.1" max="0.5" step="0.05" value={testSize} onChange={e => setTestSize(parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        <Button onClick={handleTrain} className="w-full">Train Model</Button>
                    </div>
                </Card>

                <Card className="lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4 text-blue-400">Results</h2>
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                                <XAxis type="number" dataKey="x" name="X" unit="" stroke="#A0AEC0" />
                                <YAxis type="number" dataKey="y" name="Y" unit="" stroke="#A0AEC0" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568' }} />
                                <Scatter name="Data" data={results?.data || []} fill="#4299E1" />
                                {modelParams && (
                                    <Line type="monotone" dataKey="y" stroke="#38B2AC" strokeWidth={2} dot={false} activeDot={false} legendType="none"
                                          data={[{x: 0, y: modelParams.intercept}, {x: 12, y: modelParams.slope * 12 + modelParams.intercept}]}/>
                                )}
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                     {results && modelParams && (
                        <div className="mt-4 text-center">
                            <p>Slope: {modelParams.slope.toFixed(4)}, Intercept: {modelParams.intercept.toFixed(4)}</p>
                            <p>Test MSE: {results.mse.toFixed(4)}</p>
                            <Button onClick={handleExplain} isLoading={isLoadingExplanation} className="mt-4">Explain Results</Button>
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

export default LinearRegressionLab;
