// API service for backend integration
const API_BASE_URL = 'https://boti-boi.om-mishra.com/api';

export interface AnalysisRequest {
  image: File;
  imageType: 'xray' | 'gum';
}

// Backend response interfaces (what your Flask backend actually sends)
export interface XrayBackendResponse {
  predictions: Array<{
    class: string;
    confidence: number;
    bbox: number[];
  }>;
  severity: string;
  processing_time: number;
  annotated_image: string;
}

export interface GumBackendResponse {
  prediction: string;
  confidence: number;
  severity: string;
}

// Unified frontend interface (what your components expect)
export interface UnifiedAnalysisResponse {
  disease: string;
  confidence: number;
  severity: 'low' | 'moderate' | 'high';
  description: string;
  recommendations?: string;
  annotated_image?: string;
  predictions?: Array<{
    class: string;
    confidence: number;
    bbox: number[];
  }>;
}

export interface ChatGPTRequest {
  disease: string;
  severity: string;
  context: string;
}

export interface ChatGPTResponse {
  recommendations: string;
}

// Helper function to generate descriptions based on disease and severity
const generateDescription = (disease: string, severity: string, imageType: 'xray' | 'gum'): string => {
  const descriptions = {
    xray: {
      'Caries': {
        low: 'Early stage tooth decay detected. Minor cavities that can be easily treated with proper oral hygiene.',
        moderate: 'Moderate tooth decay detected. Cavities require professional treatment to prevent further progression.',
        high: 'Advanced tooth decay detected. Immediate professional intervention required to prevent tooth loss.'
      },
      'Crown': {
        low: 'Crown detected in good condition.',
        moderate: 'Crown detected with some signs of wear or minor issues.',
        high: 'Crown detected with significant issues requiring attention.'
      },
      'Missing teeth': {
        low: 'Single missing tooth detected.',
        moderate: 'Multiple missing teeth detected.',
        high: 'Extensive tooth loss detected requiring comprehensive treatment.'
      },
      'Periodontal lesion': {
        low: 'Minor periodontal lesion detected.',
        moderate: 'Moderate periodontal lesion requiring treatment.',
        high: 'Severe periodontal lesion requiring immediate attention.'
      },
      // Add more as needed
      default: {
        low: `Early stage ${disease} condition detected with good prognosis.`,
        moderate: `Moderate ${disease} condition requiring professional attention.`,
        high: `Advanced ${disease} condition requiring immediate treatment.`
      }
    },
    gum: {
      'Calculus': {
        low: 'Minor tartar buildup detected. Can be addressed with professional cleaning.',
        moderate: 'Moderate tartar accumulation requiring professional removal.',
        high: 'Heavy tartar buildup requiring immediate professional intervention.'
      },
      'Caries': {
        low: 'Early dental caries detected in gum line area.',
        moderate: 'Moderate dental caries affecting gum health.',
        high: 'Advanced dental caries with significant gum involvement.'
      },
      'Gingivitis': {
        low: 'Mild gum inflammation detected. Early stage gingivitis with good treatment response expected.',
        moderate: 'Moderate gingivitis with noticeable inflammation requiring treatment.',
        high: 'Severe gingivitis with significant inflammation requiring immediate care.'
      },
      'Mouth Ulcer': {
        low: 'Minor mouth ulcer detected. Should heal with proper care.',
        moderate: 'Moderate mouth ulcer requiring attention.',
        high: 'Severe mouth ulcer requiring medical evaluation.'
      },
      'Tooth Discoloration': {
        low: 'Minor tooth discoloration detected.',
        moderate: 'Noticeable tooth discoloration affecting appearance.',
        high: 'Severe tooth discoloration requiring professional treatment.'
      },
      'Hypodontia': {
        low: 'Mild hypodontia (missing teeth) detected.',
        moderate: 'Moderate hypodontia affecting dental function.',
        high: 'Severe hypodontia requiring comprehensive treatment planning.'
      },
      default: {
        low: `Early stage ${disease} condition detected.`,
        moderate: `Moderate ${disease} condition requiring attention.`,
        high: `Advanced ${disease} condition requiring immediate care.`
      }
    }
  };

  const typeDescriptions = descriptions[imageType];
  const diseaseDescriptions = typeDescriptions[disease as keyof typeof typeDescriptions] || typeDescriptions.default;
  return diseaseDescriptions[severity as keyof typeof diseaseDescriptions] || `${disease} detected with ${severity} severity.`;
};

// Transform backend responses to unified format
const transformXrayResponse = (backendResponse: XrayBackendResponse): UnifiedAnalysisResponse => {
  // Get the primary detection (highest confidence)
  const primaryDetection = backendResponse.predictions.length > 0 
    ? backendResponse.predictions.reduce((prev, current) => 
        (prev.confidence > current.confidence) ? prev : current
      )
    : null;

  const disease = primaryDetection ? primaryDetection.class : 'No significant findings';
  const confidence = primaryDetection ? Math.round(primaryDetection.confidence * 100) : 0;

  return {
    disease,
    confidence,
    severity: backendResponse.severity as 'low' | 'moderate' | 'high',
    description: generateDescription(disease, backendResponse.severity, 'xray'),
    annotated_image: backendResponse.annotated_image,
    predictions: backendResponse.predictions
  };
};

const transformGumResponse = (backendResponse: GumBackendResponse): UnifiedAnalysisResponse => {
  return {
    disease: backendResponse.prediction,
    confidence: Math.round(backendResponse.confidence * 100),
    severity: backendResponse.severity as 'low' | 'moderate' | 'high',
    description: generateDescription(backendResponse.prediction, backendResponse.severity, 'gum')
  };
};

// Main analysis function
export const analyzeWithYOLOModel = async (
  image: File,
  modelType: 'xray' | 'gum'
): Promise<UnifiedAnalysisResponse> => {
  const formData = new FormData();
  formData.append('image', image);

  try {
    if (modelType === 'xray') {
      const response = await fetch(`${API_BASE_URL}/analyze/xray`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`X-ray analysis failed: ${response.statusText}`);
      }

      const backendResponse: XrayBackendResponse = await response.json();
      const transformedResponse = transformXrayResponse(backendResponse);
      
      // Get AI recommendations
      try {
        const recommendations = await getChatGPTRecommendations({
          disease: transformedResponse.disease,
          severity: transformedResponse.severity,
          context: `X-ray analysis showing ${transformedResponse.disease} with ${transformedResponse.severity} severity`
        });
        transformedResponse.recommendations = recommendations.recommendations;
      } catch (error) {
        console.warn('Failed to get AI recommendations:', error);
        // Continue without recommendations
      }

      return transformedResponse;
    }

    if (modelType === 'gum') {
      const response = await fetch(`${API_BASE_URL}/analyze/gum`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Gum analysis failed: ${response.statusText}`);
      }

      const backendResponse: GumBackendResponse = await response.json();
      const transformedResponse = transformGumResponse(backendResponse);
      
      // Get AI recommendations
      try {
        const recommendations = await getChatGPTRecommendations({
          disease: transformedResponse.disease,
          severity: transformedResponse.severity,
          context: `Gum analysis showing ${transformedResponse.disease} with ${transformedResponse.severity} severity`
        });
        transformedResponse.recommendations = recommendations.recommendations;
      } catch (error) {
        console.warn('Failed to get AI recommendations:', error);
        // Continue without recommendations
      }

      return transformedResponse;
    }

    throw new Error('Invalid model type');
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
};

// ChatGPT Integration
export const getChatGPTRecommendations = async (
  request: ChatGPTRequest
): Promise<ChatGPTResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/recommendations/chatgpt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        disease: request.disease,
        severity: request.severity,
        context: request.context,
        prompt: `As a dental professional, provide treatment recommendations for a patient diagnosed with ${request.disease} with ${request.severity} severity. Context: ${request.context}. Please provide specific, actionable treatment advice.`
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get ChatGPT recommendations: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('ChatGPT recommendation error:', error);
    throw error;
  }
};

// Mock data for development (remove when backend is ready)
export const getMockAnalysis = async (
  image: File,
  imageType: 'xray' | 'gum'
): Promise<UnifiedAnalysisResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));

  const mockResponses = {
    xray: {
      disease: "Dental Caries (Tooth Decay)",
      confidence: 87,
      severity: "moderate" as const,
      description: "Multiple cavities detected in molars with moderate progression. Early intervention recommended to prevent further deterioration.",
      recommendations: "1. Schedule immediate dental cleaning\n2. Consider fluoride treatment\n3. Improve daily oral hygiene routine\n4. Reduce sugar intake\n5. Follow up in 3 months",
      annotated_image: "base64-encoded-image-here"
    },
    gum: {
      disease: "Gingivitis",
      confidence: 92,
      severity: "low" as const,
      description: "Mild inflammation of gums detected. Early stage gum disease with good prognosis if treated promptly.",
      recommendations: "1. Improve brushing technique\n2. Use antimicrobial mouthwash\n3. Regular dental cleanings every 6 months\n4. Consider electric toothbrush\n5. Floss daily"
    }
  };

  return mockResponses[imageType];
};