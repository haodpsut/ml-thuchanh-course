
import { Dataset, QuizQuestion } from './types';

export const OPEN_ROUTER_MODELS: string[] = [
  'mistralai/mistral-7b-instruct-free',
  'google/gemma-7b-it-free',
  'nousresearch/nous-hermes-2-mixtral-8x7b-dpo',
  'openchat/openchat-7b',
];

export const IRIS_DATASET: Dataset = {
  // Sample of Iris dataset: Sepal Length, Sepal Width -> Species (0 or 1)
  features: [
    [5.1, 3.5], [4.9, 3.0], [4.7, 3.2], [4.6, 3.1], [5.0, 3.6], // Class 0
    [7.0, 3.2], [6.4, 3.2], [6.9, 3.1], [5.5, 2.3], [6.5, 2.8]  // Class 1
  ],
  labels: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
  featureNames: ['Sepal Length', 'Sepal Width'],
};

export const LINEAR_DATASET: Dataset = {
  // Simple linear data: X -> Y
  features: [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]],
  labels: [2.5, 3.5, 4.0, 5.1, 6.2, 6.8, 8.1, 8.5, 9.7, 10.2],
  featureNames: ['X'],
};

export const DECISION_TREE_DATASET: Dataset = {
  // Outlook, Temperature, Humidity, Windy -> PlayTennis
  // 0:Sunny, 1:Overcast, 2:Rainy
  // 0:Hot, 1:Mild, 2:Cool
  // 0:High, 1:Normal
  // 0:False, 1:True
  features: [
    [0, 0, 0, 0], // Sunny, Hot, High, False -> No (0)
    [0, 0, 0, 1], // Sunny, Hot, High, True -> No (0)
    [1, 0, 0, 0], // Overcast, Hot, High, False -> Yes (1)
    [2, 1, 0, 0], // Rainy, Mild, High, False -> Yes (1)
    [2, 2, 1, 0], // Rainy, Cool, Normal, False -> Yes (1)
    [2, 2, 1, 1], // Rainy, Cool, Normal, True -> No (0)
    [1, 2, 1, 1], // Overcast, Cool, Normal, True -> Yes (1)
    [0, 1, 0, 0], // Sunny, Mild, High, False -> No (0)
    [0, 2, 1, 0], // Sunny, Cool, Normal, False -> Yes (1)
    [2, 1, 1, 0], // Rainy, Mild, Normal, False -> Yes (1)
    [0, 1, 1, 1], // Sunny, Mild, Normal, True -> Yes (1)
    [1, 1, 0, 1], // Overcast, Mild, High, True -> Yes (1)
    [1, 0, 1, 0], // Overcast, Hot, Normal, False -> Yes (1)
    [2, 1, 0, 1], // Rainy, Mild, High, True -> No (0)
  ],
  labels: [0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0],
  featureNames: ['Outlook', 'Temperature', 'Humidity', 'Windy'],
};


export const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        question: "Which of the following is an example of Supervised Learning?",
        options: ["Clustering", "Dimensionality Reduction", "Classification", "Association Rule Mining"],
        correctAnswerIndex: 2,
        explanation: "Supervised learning involves learning a function that maps an input to an output based on example input-output pairs. Classification is a classic example where the model learns to assign labels to input data."
    },
    {
        question: "What is the primary goal of Linear Regression?",
        options: ["To group similar data points together", "To find the best-fitting straight line through data points", "To classify data into distinct categories", "To visualize the structure of a decision-making process"],
        correctAnswerIndex: 1,
        explanation: "Linear Regression is a regression algorithm that models the relationship between a dependent variable and one or more independent variables by fitting a linear equation (a straight line) to the observed data."
    },
    {
        question: "Increasing the depth of a Decision Tree can lead to:",
        options: ["Underfitting", "Higher bias", "Lower variance", "Overfitting"],
        correctAnswerIndex: 3,
        explanation: "A deeper decision tree can learn the training data too well, capturing noise and specific patterns that don't generalize to new data. This phenomenon is called overfitting."
    },
    {
        question: "A confusion matrix is used to evaluate the performance of which type of model?",
        options: ["Regression", "Clustering", "Classification", "Reinforcement Learning"],
        correctAnswerIndex: 2,
        explanation: "A confusion matrix is a table used to describe the performance of a classification model on a set of test data for which the true values are known. It shows true positives, true negatives, false positives, and false negatives."
    }
];
