/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { KeyIcon } from './icons';

interface ApiKeyDialogProps {
  onContinue: () => void;
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ onContinue }) => {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#121212] border border-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-10 text-center flex flex-col items-center relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
        
        <div className="bg-amber-900/20 p-4 rounded-full mb-6 border border-amber-900/30">
          <KeyIcon className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Paid API Key Required</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Veo is a paid-only video generation model. To use this feature, please select an API key associated with a paid Google Cloud project that has billing enabled.
        </p>
        <div className="text-gray-500 mb-10 text-sm flex gap-4 justify-center">
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 hover:text-amber-500 hover:underline font-medium transition-colors"
          >
            How to enable billing
          </a>
          <span className="text-gray-700">•</span>
          <a
            href="https://ai.google.dev/gemini-api/docs/pricing#veo-3"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 hover:text-amber-500 hover:underline font-medium transition-colors"
          >
            Veo pricing
          </a>
        </div>
        <button
          onClick={onContinue}
          className="w-full px-6 py-3.5 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-amber-900/20 tracking-wide text-sm uppercase"
        >
          Select Paid API Key
        </button>
      </div>
    </div>
  );
};

export default ApiKeyDialog;