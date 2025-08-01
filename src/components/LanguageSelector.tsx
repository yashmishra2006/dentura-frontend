import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../types';

interface LanguageSelectorProps {
  currentLanguage: Language['code'];
  onLanguageChange: (language: Language['code']) => void;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange
}) => {
  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-white/30">
        <Globe className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-medium text-gray-700">
          {languages.find(lang => lang.code === currentLanguage)?.flag}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {languages.find(lang => lang.code === currentLanguage)?.name}
        </span>
      </button>
      
      <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-purple-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => onLanguageChange(language.code)}
            className={`w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-purple-50/50 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg ${
              currentLanguage === language.code ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700' : 'text-gray-700'
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <span className="font-medium">{language.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};