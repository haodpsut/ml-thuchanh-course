
export type ApiService = 'gemini' | 'openrouter';

export interface ApiSettings {
  geminiApiKey: string;
  openRouterApiKey: string;
  service: ApiService;
  openRouterModel: string;
}

export type Page = 'introduction' | 'logistic-regression' | 'linear-regression' | 'decision-tree' | 'quiz';

export interface AppContextType {
  apiSettings: ApiSettings;
  setApiSettings: (settings: ApiSettings) => void;
  isApiConfigured: boolean;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

export type Dataset = {
    features: number[][];
    labels: number[];
    featureNames: string[];
};

export type ConfusionMatrix = number[][];

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
}
