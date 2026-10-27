export type Language = 'en' | 'hi';

export interface Translations {
  heroTitle: string;
  heroAccent: string;
  heroSub: string;
  yourPhotoTitle: string;
  yourPhotoSub: string;
  uploadPhotoBtn: string;
  changePhotoBtn: string;
  dragDropHint: string;
  formatHint: string;
  templateTitle: string;
  templateSub: string;
  uploadTemplateBtn: string;
  quickPresets: string;
  presets: {
    formal: string;
    casual: string;
    school: string;
    police: string;
    doctor: string;
    military: string;
  };
  bgColorTitle: string;
  bgColors: {
    white: string;
    lightGray: string;
    darkGray: string;
    blue: string;
    black: string;
  };
  matchBtn: string;
  analyzingTitle: string;
  analyzingSub: string;
  stepAnalyzing: string;
  stepAnalyzingDesc: string;
  stepMatching: string;
  stepMatchingDesc: string;
  stepChecking: string;
  stepCheckingDesc: string;
  processingImages: string;
  resultTitle: string;
  resultSub: string;
  beforeTag: string;
  afterTag: string;
  downloadBtn: string;
  tryAgainBtn: string;
  footerNotice: string;
  featureControlsTitle: string;
  featureControlsSub: string;
  features: {
    head: string;
    headDesc: string;
    lips: string;
    lipsDesc: string;
    hair: string;
    hairDesc: string;
    clothes: string;
    clothesDesc: string;
  };
  qualityTitle: string;
  qualityModes: {
    fourK: string;
    fourKBadge: string;
    hd: string;
    hdBadge: string;
  };
  serverStatus: {
    checking: string;
    online: string;
    offline: string;
    offlineDesc: string;
    recheckBtn: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    heroTitle: 'Match your photo. ',
    heroAccent: 'Automatically.',
    heroSub:
      'Upload your photo and a template. Our AI will match your face with the outfit — instantly and perfectly.',
    yourPhotoTitle: 'Your Photo',
    yourPhotoSub: 'Upload a clear photo of yourself',
    uploadPhotoBtn: 'Upload Photo',
    changePhotoBtn: 'Change Photo',
    dragDropHint: 'Click or drag image here',
    formatHint: 'JPG, PNG, WEBP • Max 10MB',
    templateTitle: 'Template / Uniform',
    templateSub: 'Upload the outfit or uniform template',
    uploadTemplateBtn: 'Upload Template',
    quickPresets: 'Quick Uniform Presets',
    presets: {
      formal: 'Formal',
      casual: 'Casual',
      school: 'School',
      police: 'Police',
      doctor: 'Doctor',
      military: 'Military',
    },
    bgColorTitle: 'Background Color',
    bgColors: {
      white: 'White',
      lightGray: 'Light Gray',
      darkGray: 'Dark Gray',
      blue: 'Blue',
      black: 'Black',
    },
    matchBtn: 'MATCH',
    analyzingTitle: 'Analyzing your photos...',
    analyzingSub: 'Our AI is working its magic. Please wait a moment.',
    stepAnalyzing: 'Analyzing',
    stepAnalyzingDesc: 'Detecting face & outfit',
    stepMatching: 'Matching',
    stepMatchingDesc: 'Applying the template',
    stepChecking: 'Checking',
    stepCheckingDesc: 'Final adjustments',
    processingImages: 'Processing your images...',
    resultTitle: 'All set!',
    resultSub: "Here's your matched result. You can download it or try again.",
    beforeTag: 'Before',
    afterTag: 'After',
    downloadBtn: 'Download',
    tryAgainBtn: 'Try Again',
    footerNotice:
      'Your images are processed temporarily and removed after processing. Use only photos you own or have permission to edit.',
    featureControlsTitle: 'AI Swap Features & Controls',
    featureControlsSub: 'Select granular components to swap with AI precision',
    features: {
      head: 'Head & Face',
      headDesc: 'Facial identity & bone structure',
      lips: 'Lips & Smile',
      lipsDesc: 'Mouth expression, lips curvature & smile',
      hair: 'Hair & Hairstyle',
      hairDesc: 'Hairstyle transfer & shoulder hair adapt',
      clothes: 'Clothes & Neck',
      clothesDesc: 'Outfit fitting & seamless collar skin tone',
    },
    qualityTitle: 'Export Quality Mode',
    qualityModes: {
      fourK: '4K Ultra-HD (2160p)',
      fourKBadge: 'Studio 4K',
      hd: 'Full HD (1080p)',
      hdBadge: 'Standard',
    },
    serverStatus: {
      checking: 'Checking server...',
      online: 'AI Server Online',
      offline: 'AI Server Offline',
      offlineDesc: 'Backend AI server is offline or unreachable. Please ensure the backend is running on port 8000.',
      recheckBtn: 'Re-check Server',
    },
  },
  hi: {
    heroTitle: 'अपनी फोटो मैच करें। ',
    heroAccent: 'अपने आप।',
    heroSub:
      'अपनी फोटो और एक टेम्पलेट अपलोड करें। हमारा AI आपके चेहरे को पोशाक से तुरंत और सटीक रूप से मिला देगा।',
    yourPhotoTitle: 'आपकी फोटो',
    yourPhotoSub: 'अपनी एक साफ़ फोटो अपलोड करें',
    uploadPhotoBtn: 'फोटो अपलोड करें',
    changePhotoBtn: 'फोटो बदलें',
    dragDropHint: 'यहाँ क्लिक करें या फोटो खींचें',
    formatHint: 'JPG, PNG, WEBP • अधिकतम 10MB',
    templateTitle: 'टेम्पलेट / यूनिफॉर्म',
    templateSub: 'आउटफिट या यूनिफॉर्म टेम्पलेट अपलोड करें',
    uploadTemplateBtn: 'टेम्पलेट अपलोड करें',
    quickPresets: 'त्वरित यूनिफॉर्म प्रीसेट',
    presets: {
      formal: 'फॉर्मल',
      casual: 'कैजुअल',
      school: 'स्कूल',
      police: 'पुलिस',
      doctor: 'डॉक्टर',
      military: 'मिलिट्री',
    },
    bgColorTitle: 'बैकग्राउंड रंग',
    bgColors: {
      white: 'सफेद',
      lightGray: 'हल्का ग्रे',
      darkGray: 'गहरा ग्रे',
      blue: 'नीला',
      black: 'काला',
    },
    matchBtn: 'मैच करें',
    analyzingTitle: 'आपकी तस्वीरों का विश्लेषण हो रहा है...',
    analyzingSub: 'हमारा AI काम कर रहा है। कृपया कुछ क्षण प्रतीक्षा करें।',
    stepAnalyzing: 'विश्लेषण',
    stepAnalyzingDesc: 'चेहरा और पोशाक पहचान',
    stepMatching: 'मैचिंग',
    stepMatchingDesc: 'टेम्पलेट लागू हो रहा है',
    stepChecking: 'जाँच',
    stepCheckingDesc: 'अंतिम समायोजन',
    processingImages: 'छवियाँ प्रोसेस की जा रही हैं...',
    resultTitle: 'सब तैयार है!',
    resultSub: 'यह रहा आपका परिणाम। आप इसे डाउनलोड कर सकते हैं या पुनः प्रयास कर सकते हैं।',
    beforeTag: 'पहले',
    afterTag: 'बाद में',
    downloadBtn: 'डाउनलोड करें',
    tryAgainBtn: 'फिर से प्रयास करें',
    footerNotice:
      'आपकी छवियाँ केवल अस्थायी रूप से प्रोसेस की जाती हैं और बाद में हटा दी जाती हैं। केवल उन्हीं तस्वीरों का उपयोग करें जिनके संपादन की आपके पास अनुमति है।',
    featureControlsTitle: 'AI स्वैप फीचर्स और कंट्रोल्स',
    featureControlsSub: 'चुनें कि फोटो में कौन-से तत्व बदलने और मिलाने हैं',
    features: {
      head: 'सिर व चेहरा',
      headDesc: 'चेहरे की पहचान व बनावट',
      lips: 'होंठ व मुस्कान',
      lipsDesc: 'मुंह का भाव, होंठों का आकार व स्माइल',
      hair: 'बाल व हेयरस्टाइल',
      hairDesc: 'हेयरकट ट्रांसफर व हेयरलाइन मिलान',
      clothes: 'पोशाक व कॉलर',
      clothesDesc: 'कपड़े की फिटिंग व स्किन टोन मैच',
    },
    qualityTitle: 'एक्सपोर्ट क्वालिटी मोड',
    qualityModes: {
      fourK: '4K अल्ट्रा-HD (2160p)',
      fourKBadge: 'स्टूडियो 4K',
      hd: 'फुल HD (1080p)',
      hdBadge: 'मानक',
    },
    serverStatus: {
      checking: 'सर्वर जांच रहे हैं...',
      online: 'AI सर्वर ऑनलाइन',
      offline: 'AI सर्वर ऑफलाइन',
      offlineDesc: 'AI बैकएंड सर्वर ऑफ़लाइन या अनुपलब्ध है। कृपया सुनिश्चित करें कि बैकएंड पोर्ट 8000 पर चल रहा है।',
      recheckBtn: 'पुनः जांचें',
    },
  },
};
