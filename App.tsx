
import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';
import ApiKeyModal from './components/ApiKeyModal';
import Sidebar from './components/Sidebar';
import Introduction from './pages/Introduction';
import LogisticRegressionLab from './pages/LogisticRegressionLab';
import LinearRegressionLab from './pages/LinearRegressionLab';
import DecisionTreeLab from './pages/DecisionTreeLab';
import Quiz from './pages/Quiz';

const App: React.FC = () => {
  const { isApiConfigured, currentPage } = useContext(AppContext);

  const renderPage = () => {
    switch (currentPage) {
      case 'introduction':
        return <Introduction />;
      case 'logistic-regression':
        return <LogisticRegressionLab />;
      case 'linear-regression':
        return <LinearRegressionLab />;
      case 'decision-tree':
        return <DecisionTreeLab />;
      case 'quiz':
        return <Quiz />;
      default:
        return <Introduction />;
    }
  };

  if (!isApiConfigured) {
    return <ApiKeyModal />;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
