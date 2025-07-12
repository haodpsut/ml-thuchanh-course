
import React, { useState, useMemo, useContext } from 'react';
import { DecisionTreeClassifier, DecisionTreeNode } from '../lib/ml';
import { DECISION_TREE_DATASET } from '../constants';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { AppContext } from '../context/AppContext';
import { generateExplanation } from '../services/aiService';

interface TreeNodeProps {
    node: DecisionTreeNode;
    featureNames: string[];
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({ node, featureNames }) => {
    if (node.value !== undefined) {
        return <div className="bg-green-700 text-white font-bold p-3 rounded-md shadow-lg">Leaf: Play = {node.value === 1 ? 'Yes' : 'No'}</div>;
    }

    return (
        <div className="bg-gray-700 p-4 rounded-lg shadow-lg border border-gray-600">
            <div className="text-center font-semibold text-blue-400">
                {featureNames[node.featureIndex!]} &le; {node.threshold!.toFixed(2)}?
            </div>
            <div className="flex justify-around mt-4 gap-4">
                <div className="flex flex-col items-center">
                    <span className="text-sm text-green-400 mb-2">True</span>
                    {node.left && <TreeNodeComponent node={node.left} featureNames={featureNames} />}
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm text-red-400 mb-2">False</span>
                    {node.right && <TreeNodeComponent node={node.right} featureNames={featureNames} />}
                </div>
            </div>
        </div>
    );
};


const DecisionTreeLab: React.FC = () => {
    const { apiSettings } = useContext(AppContext);
    const [maxDepth, setMaxDepth] = useState(3);
    const [tree, setTree] = useState<DecisionTreeNode | null>(null);

    const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
    const [explanation, setExplanation] = useState('');

    const handleTrain = () => {
        const model = new DecisionTreeClassifier(maxDepth);
        model.train(DECISION_TREE_DATASET.features, DECISION_TREE_DATASET.labels);
        setTree(model.getTree());
        setExplanation('');
    };
    
    const handleExplain = async () => {
        setIsLoadingExplanation(true);
        const prompt = `I'm learning about decision trees and overfitting. I've trained a tree with a max depth of ${maxDepth}.
        Explain what's happening as I increase the max depth. How does a deeper tree (e.g., depth 10) lead to overfitting compared to a shallower tree (e.g., depth 2)?
        What are the signs of overfitting in a decision tree?`;
        
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
            <h1 className="text-4xl font-bold text-white">Lab: Decision Trees & Overfitting</h1>
            <p className="text-gray-400">Dataset: A classic dataset for predicting whether to play tennis based on weather conditions.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <Card className="lg:col-span-1">
                    <h2 className="text-xl font-semibold mb-4 text-blue-400">Hyperparameters</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Max Depth: {maxDepth}</label>
                            <input type="range" min="1" max="10" step="1" value={maxDepth} onChange={e => setMaxDepth(parseInt(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        <Button onClick={handleTrain} className="w-full">Train & Visualize Tree</Button>
                        <Button onClick={handleExplain} isLoading={isLoadingExplanation} variant="secondary" className="w-full">Explain Overfitting</Button>
                    </div>
                </Card>

                <Card className="lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4 text-blue-400">Tree Visualization</h2>
                     <div className="p-4 overflow-x-auto">
                        {tree ? (
                            <TreeNodeComponent node={tree} featureNames={DECISION_TREE_DATASET.featureNames} />
                        ) : (
                            <p className="text-gray-400 text-center">Train a model to visualize the decision tree.</p>
                        )}
                    </div>
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

export default DecisionTreeLab;
