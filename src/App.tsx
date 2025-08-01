import React, { useState } from 'react';
import { Stethoscope, Zap, Camera } from 'lucide-react';
import { LanguageSelector } from './components/LanguageSelector';
import { ImageTypeSelector } from './components/ImageTypeSelector';
import { ImageUploader } from './components/ImageUploader';
import { ProcessingIndicator } from './components/ProcessingIndicator';
import { ResultsDisplay } from './components/ResultsDisplay';
import { translations } from './utils/translations';
import { DetectionResult, ProcessingState, ImageType } from './types';
import { analyzeWithYOLOModel } from './services/api';

function App() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [selectedImageType, setSelectedImageType] = useState<ImageType['id'] | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    currentStep: '',
    progress: 0
  });
  const [results, setResults] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = translations[language];

  const handleAnalyze = async () => {
    if (!selectedImage || !selectedImageType) {
      setError(t.noImageSelected);
      return;
    }

    setError(null);
    setResults(null);
    
    // Start processing animation
    setProcessingState({
      isProcessing: true,
      currentStep: t.processingSteps.uploading,
      progress: 10
    });

    try {
      // Step 1: Uploading
      await new Promise(resolve => setTimeout(resolve, 800));
      setProcessingState(prev => ({
        ...prev,
        currentStep: t.processingSteps.preprocessing,
        progress: 30
      }));

      // Step 2: Preprocessing
      await new Promise(resolve => setTimeout(resolve, 800));
      setProcessingState(prev => ({
        ...prev,
        currentStep: t.processingSteps.analyzing,
        progress: 60
      }));

      // Step 3: AI Analysis (replace with actual API call)
      const analysisResult = await analyzeWithYOLOModel(selectedImage, selectedImageType);
      
      setProcessingState(prev => ({
        ...prev,
        currentStep: t.processingSteps.generating,
        progress: 90
      }));

      // Step 4: Final processing
      await new Promise(resolve => setTimeout(resolve, 500));
      setProcessingState(prev => ({
        ...prev,
        progress: 100
      }));

      // Complete processing
      setTimeout(() => {
        setProcessingState({
          isProcessing: false,
          currentStep: '',
          progress: 0
        });
        setResults(analysisResult);
      }, 500);

    } catch (err) {
      setProcessingState({
        isProcessing: false,
        currentStep: '',
        progress: 0
      });
      setError(t.analysisError);
      console.error('Analysis error:', err);
    }
  };

  const handleAnalyzeAnother = () => {
    setSelectedImage(null);
    setSelectedImageType(null);
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 via-blue-50 to-teal-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg border border-white/30">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{t.title}</h1>
                <p className="text-sm text-white/80">{t.subtitle}</p>
              </div>
            </div>
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl flex-1">
        {!results && !processingState.isProcessing && (
          <div className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 rounded-2xl shadow-2xl border border-purple-200/50 p-10 min-h-[700px] backdrop-blur-sm">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full mb-4 shadow-lg">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-3">{t.uploadTitle}</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.uploadSubtitle}</p>
            </div>

            {/* Image Type Selection */}
            <ImageTypeSelector
              selectedType={selectedImageType}
              onTypeSelect={setSelectedImageType}
              language={language}
            />

            {/* Upload Guidelines */}
            {selectedImageType && (
              <div className="mb-8 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 rounded-xl p-6 border border-purple-200/50 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></div>
                  {t.uploadGuidelines.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-purple-100">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      {selectedImageType === 'xray' ? (
                        <Zap className="w-4 h-4 mr-2 text-purple-500" />
                      ) : (
                        <Camera className="w-4 h-4 mr-2 text-pink-500" />
                      )}
                      {selectedImageType === 'xray' ? 'X-Ray' : 'Gum Image'} Tips
                    </h4>
                    <ul className="space-y-2">
                      {(selectedImageType === 'xray' ? t.uploadGuidelines.xrayTips : t.uploadGuidelines.gumTips).map((tip, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-indigo-100">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <div className="w-4 h-4 mr-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
                      General Guidelines
                    </h4>
                    <ul className="space-y-2">
                      {t.uploadGuidelines.general.map((guideline, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          {guideline}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Image Upload */}
            {selectedImageType && (
              <div className="space-y-6">
                <ImageUploader
                  onImageSelect={setSelectedImage}
                  selectedImage={selectedImage}
                  language={language}
                  disabled={processingState.isProcessing}
                />

                {error && (
                  <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4 shadow-sm">
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                )}

                {selectedImage && (
                  <button
                    onClick={handleAnalyze}
                    disabled={processingState.isProcessing}
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    {t.analyze}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Processing Indicator */}
        <ProcessingIndicator 
          processingState={processingState}
          language={language}
        />

        {/* Results Display */}
        {results && (
          <ResultsDisplay
            results={results}
            language={language}
            onAnalyzeAnother={handleAnalyzeAnother}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">
            © 2025 Dental Disease Detection System. 
            {language === 'en' ? ' Powered by AI Technology.' : ' AI तकनीक द्वारा संचालित।'}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;