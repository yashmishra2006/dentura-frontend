export const translations = {
  en: {
    title: "ToothSense",
    subtitle: "AI-powered dental diagnosis with X-ray and gum image analysis",
    uploadTitle: "Upload Medical Image",
    uploadSubtitle: "Select image type and upload for AI analysis",
    imageTypes: {
      xray: {
        name: "X-Ray Image",
        description: "Dental X-ray for comprehensive analysis"
      },
      gum: {
        name: "Gum Image", 
        description: "Clinical photo of gums and teeth"
      }
    },
    dragAndDrop: "Drag and drop your image here, or click to browse",
    supportedFormats: "Supported formats: JPG, PNG, WEBP (Max 10MB)",
    uploadGuidelines: {
      title: "Image Upload Guidelines",
      xrayTips: [
        "Ensure the X-ray image is clear and well-lit",
        "Include the full dental arch for comprehensive analysis",
        "Avoid blurry or overexposed images",
        "Digital X-rays provide better results than scanned films"
      ],
      gumTips: [
        "Take photos in good lighting conditions",
        "Ensure gums and teeth are clearly visible",
        "Avoid shadows or reflections from dental instruments",
        "Close-up shots work best for detailed analysis"
      ],
      general: [
        "Use high-resolution images (minimum 800x600 pixels)",
        "Ensure file size is under 10MB",
        "Supported formats: JPG, PNG, WEBP",
        "Remove any personal information from images before upload"
      ]
    },
    analyze: "Analyze Image",
    processing: "Processing Image...",
    processingSteps: {
      uploading: "Uploading image...",
      preprocessing: "Preprocessing image data...",
      analyzing: "Running AI analysis...",
      generating: "Generating recommendations..."
    },
    results: {
      title: "Analysis Results",
      diseaseDetected: "Disease Detected",
      confidence: "Confidence Level",
      severity: "Severity Level",
      description: "Description",
      recommendations: "Treatment Recommendations",
      downloadReport: "Download Report",
      analyzeAnother: "Analyze Another Image"
    },
    severity: {
      low: "Low Risk",
      moderate: "Moderate Risk", 
      high: "High Risk"
    },
    noImageSelected: "Please select an image to analyze",
    analysisError: "Analysis failed. Please try again.",
    loading: "Loading..."
  },
  hi: {
    title: "ToothSense",
    subtitle: "एक्स-रे और मसूड़ों की छवि विश्लेषण के साथ AI-संचालित दंत निदान",
    uploadTitle: "मेडिकल इमेज अपलोड करें",
    uploadSubtitle: "छवि प्रकार चुनें और AI विश्लेषण के लिए अपलोड करें",
    imageTypes: {
      xray: {
        name: "एक्स-रे छवि",
        description: "व्यापक विश्लेषण के लिए दंत एक्स-रे"
      },
      gum: {
        name: "मसूड़ों की छवि",
        description: "मसूड़ों और दांतों की क्लिनिकल फोटो"
      }
    },
    dragAndDrop: "अपनी छवि यहां खींचें और छोड़ें, या ब्राउज़ करने के लिए क्लिक करें",
    supportedFormats: "समर्थित प्रारूप: JPG, PNG, WEBP (अधिकतम 10MB)",
    uploadGuidelines: {
      title: "छवि अपलोड दिशानिर्देश",
      xrayTips: [
        "सुनिश्चित करें कि एक्स-रे छवि स्पष्ट और अच्छी तरह से प्रकाशित है",
        "व्यापक विश्लेषण के लिए पूर्ण दंत चाप शामिल करें",
        "धुंधली या अधिक एक्सपोज़्ड छवियों से बचें",
        "डिजिटल एक्स-रे स्कैन की गई फिल्मों से बेहतर परिणाम देते हैं"
      ],
      gumTips: [
        "अच्छी रोशनी की स्थिति में फोटो लें",
        "सुनिश्चित करें कि मसूड़े और दांत स्पष्ट रूप से दिखाई दें",
        "दंत उपकरणों से छाया या प्रतिबिंब से बचें",
        "विस्तृत विश्लेषण के लिए क्लोज़-अप शॉट्स सबसे अच्छे काम करते हैं"
      ],
      general: [
        "उच्च-रिज़ॉल्यूशन छवियों का उपयोग करें (न्यूनतम 800x600 पिक्सेल)",
        "सुनिश्चित करें कि फ़ाइल का आकार 10MB से कम है",
        "समर्थित प्रारूप: JPG, PNG, WEBP",
        "अपलोड से पहले छवियों से कोई भी व्यक्तिगत जानकारी हटा दें"
      ]
    },
    analyze: "छवि का विश्लेषण करें",
    processing: "छवि प्रसंस्करण...",
    processingSteps: {
      uploading: "छवि अपलोड कर रहे हैं...",
      preprocessing: "छवि डेटा प्री-प्रोसेसिंग...",
      analyzing: "AI विश्लेषण चला रहे हैं...",
      generating: "सिफारिशें तैयार कर रहे हैं..."
    },
    results: {
      title: "विश्लेषण परिणाम",
      diseaseDetected: "रोग की पहचान",
      confidence: "विश्वास स्तर",
      severity: "गंभीरता स्तर",
      description: "विवरण",
      recommendations: "उपचार सुझाव",
      downloadReport: "रिपोर्ट डाउनलोड करें",
      analyzeAnother: "अन्य छवि का विश्लेषण करें"
    },
    severity: {
      low: "कम जोखिम",
      moderate: "मध्यम जोखिम",
      high: "उच्च जोखिम"
    },
    noImageSelected: "कृपया विश्लेषण के लिए एक छवि चुनें",
    analysisError: "विश्लेषण विफल। कृपया पुनः प्रयास करें।",
    loading: "लोड हो रहा है..."
  }
};