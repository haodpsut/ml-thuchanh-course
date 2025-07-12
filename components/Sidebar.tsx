
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Page } from '../types';
import { BookOpen, Activity, Target, GitBranch, HelpCircle, Settings } from 'lucide-react';

const iconMap = {
    introduction: <BookOpen size={20} />,
    'linear-regression': <Activity size={20} />,
    'logistic-regression': <Target size={20} />,
    'decision-tree': <GitBranch size={20} />,
    quiz: <HelpCircle size={20} />,
};

const Sidebar: React.FC = () => {
    const { currentPage, setCurrentPage, setApiSettings } = useContext(AppContext);

    const navItems: { id: Page; label: string }[] = [
        { id: 'introduction', label: 'Introduction' },
        { id: 'linear-regression', label: 'Linear Regression' },
        { id: 'logistic-regression', label: 'Logistic Regression' },
        { id: 'decision-tree', label: 'Decision Trees' },
        { id: 'quiz', label: 'Quiz' },
    ];

    const handleResetKeys = () => {
        localStorage.removeItem('mlLabApiSettings');
        setApiSettings({
            geminiApiKey: '',
            openRouterApiKey: '',
            service: 'gemini',
            openRouterModel: '',
        });
        window.location.reload();
    };

    return (
        <aside className="w-64 bg-gray-800 p-4 flex flex-col border-r border-gray-700">
            <h1 className="text-2xl font-bold text-white mb-8">ML Lab</h1>
            <nav className="flex-1">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.id} className="mb-2">
                            <button
                                onClick={() => setCurrentPage(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-md transition-colors ${currentPage === item.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                {iconMap[item.id]}
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-auto">
                <button
                    onClick={handleResetKeys}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-md transition-colors text-gray-300 hover:bg-gray-700"
                >
                    <Settings size={20} />
                    <span>API Settings</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
