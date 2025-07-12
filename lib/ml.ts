
import { ConfusionMatrix, Dataset } from '../types';

// Sigmoid function
const sigmoid = (z: number): number => 1 / (1 + Math.exp(-z));

// Fisher-Yates shuffle
const shuffle = (data: any[][], labels: number[]) => {
    for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]];
        [labels[i], labels[j]] = [labels[j], labels[i]];
    }
};

export const trainTestSplit = (features: number[][], labels: number[], testSize: number = 0.3): { X_train: number[][], y_train: number[], X_test: number[][], y_test: number[] } => {
    const data = features.map((feature, i) => [...feature, labels[i]]);
    shuffle(data, labels); // Not the best way, but simple. Let's shuffle features and labels in sync.
    const shuffledFeatures = features.slice();
    const shuffledLabels = labels.slice();
    shuffle(shuffledFeatures, shuffledLabels);


    const splitIndex = Math.floor(features.length * (1 - testSize));
    return {
        X_train: shuffledFeatures.slice(0, splitIndex),
        y_train: shuffledLabels.slice(0, splitIndex),
        X_test: shuffledFeatures.slice(splitIndex),
        y_test: shuffledLabels.slice(splitIndex),
    };
};

export class LogisticRegression {
    private weights: number[] = [];
    private bias: number = 0;

    train(X: number[][], y: number[], learningRate: number, epochs: number) {
        const n_samples = X.length;
        const n_features = X[0].length;
        this.weights = new Array(n_features).fill(0);
        this.bias = 0;

        for (let epoch = 0; epoch < epochs; epoch++) {
            let dw = new Array(n_features).fill(0);
            let db = 0;

            for (let i = 0; i < n_samples; i++) {
                const linear_model = X[i].reduce((acc, x_i, j) => acc + x_i * this.weights[j], 0) + this.bias;
                const y_predicted = sigmoid(linear_model);
                const error = y_predicted - y[i];

                for (let j = 0; j < n_features; j++) {
                    dw[j] += (1 / n_samples) * X[i][j] * error;
                }
                db += (1 / n_samples) * error;
            }

            this.weights = this.weights.map((w, j) => w - learningRate * dw[j]);
            this.bias -= learningRate * db;
        }
    }

    predict(X: number[]): number {
        const linear_model = X.reduce((acc, x_i, j) => acc + x_i * this.weights[j], 0) + this.bias;
        const y_predicted = sigmoid(linear_model);
        return y_predicted >= 0.5 ? 1 : 0;
    }
}

export const calculateAccuracy = (y_true: number[], y_pred: number[]): number => {
    const correct = y_true.filter((y, i) => y === y_pred[i]).length;
    return (correct / y_true.length) * 100;
};

export const calculateConfusionMatrix = (y_true: number[], y_pred: number[]): ConfusionMatrix => {
    const matrix: ConfusionMatrix = [[0, 0], [0, 0]]; // [[TN, FP], [FN, TP]]
    for (let i = 0; i < y_true.length; i++) {
        const true_label = y_true[i];
        const pred_label = y_pred[i];
        if (true_label === 0 && pred_label === 0) matrix[0][0]++; // TN
        if (true_label === 0 && pred_label === 1) matrix[0][1]++; // FP
        if (true_label === 1 && pred_label === 0) matrix[1][0]++; // FN
        if (true_label === 1 && pred_label === 1) matrix[1][1]++; // TP
    }
    return matrix;
};


export class LinearRegression {
    private slope: number = 0;
    private intercept: number = 0;

    train(X: number[][], y: number[], learningRate: number, epochs: number) {
        const n = y.length;
        this.slope = 0;
        this.intercept = 0;

        for (let i = 0; i < epochs; i++) {
            let y_pred = X.map(x => this.slope * x[0] + this.intercept);
            const d_slope = (-2 / n) * X.reduce((acc, x, j) => acc + x[0] * (y[j] - y_pred[j]), 0);
            const d_intercept = (-2 / n) * y.reduce((acc, y_val, j) => acc + (y_val - y_pred[j]), 0);
            
            this.slope -= learningRate * d_slope;
            this.intercept -= learningRate * d_intercept;
        }
    }
    
    predict(X: number): number {
        return this.slope * X + this.intercept;
    }

    getParams(): { slope: number, intercept: number } {
        return { slope: this.slope, intercept: this.intercept };
    }
}

// Decision Tree Helper functions
const calculateEntropy = (labels: number[]): number => {
    const n = labels.length;
    if (n === 0) return 0;
    const counts = labels.reduce((acc, label) => {
        acc[label] = (acc[label] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    return Object.values(counts).reduce((entropy, count) => {
        const p = count / n;
        return entropy - p * Math.log2(p);
    }, 0);
};

export class DecisionTreeNode {
    featureIndex?: number;
    threshold?: number;
    value?: number;
    left?: DecisionTreeNode;
    right?: DecisionTreeNode;

    constructor(value?: number) {
        this.value = value;
    }
}

export class DecisionTreeClassifier {
    private root: DecisionTreeNode | null = null;
    private maxDepth: number;

    constructor(maxDepth: number = 5) {
        this.maxDepth = maxDepth;
    }

    train(X: number[][], y: number[]) {
        this.root = this._buildTree(X, y);
    }

    private _buildTree(X: number[][], y: number[], depth: number = 0): DecisionTreeNode {
        const n_samples = y.length;
        const n_features = X[0].length;
        const n_labels = new Set(y).size;

        // Base cases
        if (n_labels === 1 || n_samples < 2 || depth >= this.maxDepth) {
            const leafValue = this._mostCommonLabel(y);
            return new DecisionTreeNode(leafValue);
        }

        // Find best split
        let bestGain = -1;
        let bestFeatureIndex = -1;
        let bestThreshold = -1;

        const currentEntropy = calculateEntropy(y);
        
        for (let featIndex = 0; featIndex < n_features; featIndex++) {
            const featureValues = X.map(row => row[featIndex]);
            const uniqueValues = Array.from(new Set(featureValues));

            for(const threshold of uniqueValues) {
                const { left_indices, right_indices } = this._split(X, featIndex, threshold);
                
                if (left_indices.length === 0 || right_indices.length === 0) continue;

                const y_left = left_indices.map(i => y[i]);
                const y_right = right_indices.map(i => y[i]);

                const p_left = left_indices.length / n_samples;
                const p_right = right_indices.length / n_samples;

                const informationGain = currentEntropy - (p_left * calculateEntropy(y_left) + p_right * calculateEntropy(y_right));
                
                if(informationGain > bestGain) {
                    bestGain = informationGain;
                    bestFeatureIndex = featIndex;
                    bestThreshold = threshold;
                }
            }
        }
        
        if (bestGain <= 0) {
            return new DecisionTreeNode(this._mostCommonLabel(y));
        }

        // Recurse
        const { left_indices, right_indices } = this._split(X, bestFeatureIndex, bestThreshold);
        const X_left = left_indices.map(i => X[i]);
        const y_left = left_indices.map(i => y[i]);
        const X_right = right_indices.map(i => X[i]);
        const y_right = right_indices.map(i => y[i]);

        const node = new DecisionTreeNode();
        node.featureIndex = bestFeatureIndex;
        node.threshold = bestThreshold;
        node.left = this._buildTree(X_left, y_left, depth + 1);
        node.right = this._buildTree(X_right, y_right, depth + 1);
        return node;
    }
    
    private _split(X: number[][], featureIndex: number, threshold: number) {
        const left_indices: number[] = [];
        const right_indices: number[] = [];
        X.forEach((row, i) => {
            if (row[featureIndex] <= threshold) {
                left_indices.push(i);
            } else {
                right_indices.push(i);
            }
        });
        return { left_indices, right_indices };
    }

    private _mostCommonLabel(y: number[]): number {
        const counts = y.reduce((acc, label) => {
            acc[label] = (acc[label] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);
        return parseInt(Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b));
    }

    getTree(): DecisionTreeNode | null {
        return this.root;
    }
}
