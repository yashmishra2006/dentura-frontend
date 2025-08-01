import React from 'react';
import { Camera, Zap } from 'lucide-react';
import { ImageType } from '../types';
import { translations } from '../utils/translations';

interface ImageTypeSelectorProps {
  selectedType: ImageType['id'] | null;
  onTypeSelect: (type: ImageType['id']) => void;
  language: 'en' | 'hi';
}

export const ImageTypeSelector: React.FC<ImageTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
  language
}) => {
  const t = translations[language];
  
  const imageTypes: ImageType[] = [
    {
      id: 'xray',
      name: t.imageTypes.xray.name,
      description: t.imageTypes.xray.description,
      icon: 'zap'
    },
    {
      id: 'gum',
      name: t.imageTypes.gum.name,
      description: t.imageTypes.gum.description,
      icon: 'camera'
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'zap':
        return <Zap className="w-8 h-8" />;
      case 'camera':
        return <Camera className="w-8 h-8" />;
      default:
        return <Camera className="w-8 h-8" />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8 max-w-4xl mx-auto">
      {imageTypes.map((type) => (
        <button
          key={type.id}
          onClick={() => onTypeSelect(type.id)}
          className={`p-8 rounded-xl border-2 transition-all duration-300 text-center hover:shadow-2xl hover:scale-105 w-full md:w-80 ${
            selectedType === type.id
              ? 'border-purple-400 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 shadow-xl ring-2 ring-purple-200/50'
              : 'border-gray-200 bg-gradient-to-br from-white via-purple-50/20 to-pink-50/20 hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-50/30 hover:to-pink-50/30'
          }`}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={`p-4 rounded-full ${
              selectedType === type.id ? 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600' : 'bg-gradient-to-br from-gray-100 to-purple-100/50 text-gray-600'
            }`}>
              {getIcon(type.icon)}
            </div>
            <div>
              <h3 className={`font-bold text-xl mb-2 ${
                selectedType === type.id ? 'text-purple-900' : 'text-gray-900'
              }`}>
                {type.name}
              </h3>
              <p className={`text-base ${
                selectedType === type.id ? 'text-purple-700' : 'text-gray-600'
              }`}>
                {type.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};