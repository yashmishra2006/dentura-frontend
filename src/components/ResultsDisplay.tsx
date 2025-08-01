import React from 'react';
import { Download, RotateCcw, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { UnifiedAnalysisResponse } from '../services/api';
import { translations } from '../utils/translations';

interface ResultsDisplayProps {
  results: UnifiedAnalysisResponse;
  language: 'en' | 'hi';
  onAnalyzeAnother: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  language,
  onAnalyzeAnother
}) => {
  const t = translations[language];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'moderate':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'high':
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'moderate':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'high':
        return 'text-red-700 bg-red-100 border-red-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const downloadReport = () => {
    const reportContent = `ToothSense - Dental Analysis Report
==============================

Disease Detected: ${results.disease}
Confidence Level: ${results.confidence}%
Severity: ${t?.severity?.[results.severity] || results.severity}

Description:
${results.description}

${results.recommendations ? `Treatment Recommendations:
${results.recommendations}` : ''}

${results.predictions && results.predictions.length > 0 ? `
Detailed Detections:
${results.predictions.map(pred => 
  `- ${pred.class}: ${Math.round(pred.confidence * 100)}% confidence`
).join('\n')}` : ''}

Generated on: ${new Date().toLocaleDateString()}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toothsense-analysis-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-br from-white via-purple-50/20 to-pink-50/20 rounded-xl border border-purple-200/50 overflow-hidden shadow-xl backdrop-blur-sm">
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">{t?.results?.title || 'Analysis Results'}</h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Annotated Image */}
        {results.annotated_image && (
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Annotated Analysis</h3>
            <div className="flex justify-center">
              <img
                src={`data:image/jpeg;base64,${results.annotated_image}`}
                alt="Annotated Analysis"
                className="max-w-full max-h-[500px] object-contain rounded-md shadow-lg border border-gray-200"
              />
            </div>
          </div>
        )}

        {/* Disease Detection Card */}
        <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-lg p-4 border border-purple-100/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">{t?.results?.diseaseDetected || 'Condition Detected'}</h3>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {results.confidence}%
            </span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-md p-3 border border-purple-200/50">
            <p className="font-medium text-lg text-gray-900">{results.disease}</p>
          </div>
        </div>

        {/* Severity Level */}
        <div className="flex items-center justify-between p-4 rounded-lg border-2 bg-white">
          <div className="flex items-center space-x-3">
            {getSeverityIcon(results.severity)}
            <div>
              <p className="font-medium text-gray-900">{t?.results?.severity || 'Severity Level'}</p>
              <p className={`text-sm font-medium ${getSeverityColor(results.severity).split(' ')[0]}`}>
                {t?.severity?.[results.severity] || results.severity.charAt(0).toUpperCase() + results.severity.slice(1)}
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full border ${getSeverityColor(results.severity)}`}>
            <span className="font-semibold text-sm">
              {t?.severity?.[results.severity] || results.severity.charAt(0).toUpperCase() + results.severity.slice(1)}
            </span>
          </div>
        </div>

        {/* Multiple Detections (for X-ray) */}
        {results.predictions && results.predictions.length > 1 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">All Detections</h4>
            <div className="space-y-2">
              {results.predictions.map((prediction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="font-medium text-gray-800">{prediction.class}</span>
                  <span className="text-sm font-semibold text-gray-600">
                    {Math.round(prediction.confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">{t?.results?.description || 'Analysis Description'}</h4>
          <div className="bg-gradient-to-r from-gray-50 to-purple-50/30 rounded-lg p-4 border border-purple-200/50">
            <p className="text-gray-700 leading-relaxed">{results.description}</p>
          </div>
        </div>

        {/* Recommendations */}
        {results.recommendations && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">{t?.results?.recommendations || 'Treatment Recommendations'}</h4>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
              <div className="text-indigo-800 leading-relaxed">
                {results.recommendations.split('\n').map((line, index) => (
                  <p key={index} className="mb-1">{line}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={downloadReport}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            <Download className="w-5 h-5" />
            <span>{t?.results?.downloadReport || 'Download Report'}</span>
          </button>
          
          <button
            onClick={onAnalyzeAnother}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-slate-600 to-gray-600 text-white px-6 py-3 rounded-lg hover:from-slate-700 hover:to-gray-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{t?.results?.analyzeAnother || 'Analyze Another'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};