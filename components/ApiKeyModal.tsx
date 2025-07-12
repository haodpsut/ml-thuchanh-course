
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ApiService } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import { OPEN_ROUTER_MODELS } from '../constants';

const ApiKeyModal: React.FC = () => {
  const { setApiSettings, apiSettings: initialSettings } = useContext(AppContext);
  const [geminiKey, setGeminiKey] = useState(initialSettings.geminiApiKey);
  const [openRouterKey, setOpenRouterKey] = useState(initialSettings.openRouterApiKey);
  const [service, setService] = useState<ApiService>(initialSettings.service);
  const [openRouterModel, setOpenRouterModel] = useState(initialSettings.openRouterModel || OPEN_ROUTER_MODELS[0]);

  const handleSave = () => {
    if ((service === 'gemini' && !geminiKey) || (service === 'openrouter' && !openRouterKey)) {
        alert('Please enter the API key for the selected service.');
        return;
    }
    setApiSettings({
      geminiApiKey: geminiKey,
      openRouterApiKey: openRouterKey,
      service,
      openRouterModel,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">API Configuration</h2>
        <p className="text-gray-400 mb-6">
          Provide an API key to enable AI-powered explanations. Your keys are stored only in your browser's local storage.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">AI Service</label>
            <div className="flex space-x-2 rounded-md bg-gray-700 p-1">
                <button 
                    onClick={() => setService('gemini')}
                    className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${service === 'gemini' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                    Gemini
                </button>
                 <button 
                    onClick={() => setService('openrouter')}
                    className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${service === 'openrouter' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                    OpenRouter
                </button>
            </div>
          </div>
          
          {service === 'gemini' && (
            <div>
              <label htmlFor="gemini-key" className="block text-sm font-medium text-gray-300 mb-2">Gemini API Key</label>
              <Input
                id="gemini-key"
                type="password"
                placeholder="Enter your Google AI Studio key"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
              />
            </div>
          )}

          {service === 'openrouter' && (
            <div className="space-y-4">
               <div>
                <label htmlFor="openrouter-key" className="block text-sm font-medium text-gray-300 mb-2">OpenRouter API Key</label>
                <Input
                    id="openrouter-key"
                    type="password"
                    placeholder="Enter your OpenRouter key"
                    value={openRouterKey}
                    onChange={(e) => setOpenRouterKey(e.target.value)}
                />
                </div>
                <div>
                <label htmlFor="openrouter-model" className="block text-sm font-medium text-gray-300 mb-2">Model (Free models selected)</label>
                <Select
                    id="openrouter-model"
                    value={openRouterModel}
                    onChange={(e) => setOpenRouterModel(e.target.value)}
                >
                    {OPEN_ROUTER_MODELS.map(model => (
                        <option key={model} value={model}>{model}</option>
                    ))}
                </Select>
               </div>
            </div>
          )}
        </div>
        
        <div className="mt-8">
            <Button onClick={handleSave} className="w-full">
                Save and Continue
            </Button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
