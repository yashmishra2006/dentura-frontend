import React from 'react';
import { Loader2 } from 'lucide-react';
import { ProcessingState } from '../types';
import { translations } from '../utils/translations';

interface ProcessingIndicatorProps {
  processingState: ProcessingState;
  language: 'en' | 'hi';
}

export const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({
  processingState,
  language
}) => {
  const t = translations[language];

  if (!processingState.isProcessing) return null;

  return (
    <div className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 rounded-xl border border-purple-200/50 p-8 text-center shadow-xl backdrop-blur-sm">
      <div className="flex justify-center mb-6">
        <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {t.processing}
      </h3>
      
      <div className="max-w-md mx-auto">
        <div className="bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${processingState.progress}%` }}
          ></div>
        </div>
        
        <p className="text-gray-600 font-medium">
          {processingState.currentStep}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {processingState.progress}% {t.loading}
        </p>
      </div>
    </div>
  );
};