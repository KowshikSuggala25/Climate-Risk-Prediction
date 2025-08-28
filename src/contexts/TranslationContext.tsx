import React, { createContext, useContext, ReactNode } from "react";
import { useUser } from "./UserContext";

interface TranslationContextType {
  t: (key: string) => string;
  language: string;
}

const translations = {
  english: {
    // Navigation
    dashboard: "Dashboard",
    disaster: "Disaster",
    location: "Location",
    settings: "Settings",
    profile: "Profile",
    selectLanguage: "Select Language",
    userProfile: "User Profile",

    // Dashboard
    climateRiskPrediction: "AI Climate Risk Prediction",
    advancedForecasting:
      "Advanced forecasting for flood, heatwave, and pollution risks",
    climateRiskDashboard: "Climate Risk Dashboard",
    realTimeMonitoring: "Real-time monitoring and 7-day forecasts",
    refreshData: "Refresh Data",
    refreshing: "Refreshing...",
    currentRiskAssessment: "Current Risk Assessment",
    currentConditions: "Current Conditions",
    floodRiskForecast: "Flood Risk Forecast",
    sevenDayAnalysis: "7-day probability analysis",
    heatwavePrediction: "Heatwave Prediction",
    temperatureBasedRisk: "Temperature-based risk assessment",
    airQualityIndex: "Air Quality Index",
    pollutionLevelPredictions: "Pollution level predictions",
    emergencyContacts: "Emergency Contacts",
    emergencyNumbersFor: "Emergency numbers for",
    importantNumbers: "Important numbers for climate emergencies",
    recommendedActions: "Recommended Actions",
    actionsFor: "Actions for",
    basedOnCurrentConditions: "based on current conditions",
    basedOnCurrentRisk: "Based on current risk levels",

    // Profile
    name: "Name",
    email: "Email",
    phone: "Phone",
    save: "Save",
    cancel: "Cancel",

    // Location
    currentLocation: "Current Location",
    autoDetectedLocation: "Auto-detected location",
    locationNotAvailable: "Location not available",
    searchForCity: "Search for a city...",
    search: "Search",
    searching: "Searching...",
    coordinates: "Coordinates",
    detectedFromDevice: "Detected from your device location",
    loadingLocationData: "Loading location data...",

    // Priorities
    highPriority: "High Priority",
    mediumPriority: "Medium Priority",
    lowPriority: "Low Priority",
  },

  telugu: {
    // Navigation
    dashboard: "డాష్‌బోర్డ్",
    disaster: "విపత్తు",
    location: "స్థానం",
    settings: "సెట్టింగులు",
    profile: "ప్రొఫైల్",
    selectLanguage: "భాష ఎంచుకోండి",
    userProfile: "వినియోగదారు ప్రొఫైల్",

    // Dashboard
    climateRiskPrediction: "AI వాతావరణ ప్రమాద అంచనా",
    advancedForecasting: "వరద, వేడిమిగా మరియు కాలుష్య ప్రమాదాల అధునాతన అంచనా",
    climateRiskDashboard: "వాతావరణ ప్రమాద డాష్‌బోర్డ్",
    realTimeMonitoring: "రియల్ టైమ్ పర్యవేక్షణ మరియు 7-రోజుల అంచనాలు",
    refreshData: "డేటాను రిఫ్రెష్ చేయండి",
    refreshing: "రిఫ్రెష్ చేస్తున్నాం...",
    currentRiskAssessment: "ప్రస్తుత ప్రమాద మూల్యాంకనం",
    currentConditions: "ప్రస్తుత పరిస్థితులు",
    floodRiskForecast: "వరద ప్రమాద అంచనా",
    sevenDayAnalysis: "7-రోజుల సంభావ్యత విశ్లేషణ",
    heatwavePrediction: "వేడిమిగా అంచనా",
    temperatureBasedRisk: "ఉష్ణోగ్రత ఆధారిత ప్రమాద మూల్యాంకనం",
    airQualityIndex: "వాయు నాణ్యత సూచిక",
    pollutionLevelPredictions: "కాలుష్య స్థాయి అంచనాలు",
    emergencyContacts: "అత్యవసర సంప్రదింపులు",
    emergencyNumbersFor: "అత్యవసర నంబర్లు",
    importantNumbers: "వాతావరణ అత్యవసర పరిస్థితుల కోసం ముఖ్యమైన నంబర్లు",
    recommendedActions: "సిఫారసు చేసిన చర్యలు",
    actionsFor: "చర్యలు కోసం",
    basedOnCurrentConditions: "ప్రస్తుత పరిస్థితుల ఆధారంగా",
    basedOnCurrentRisk: "ప్రస్తుత ప్రమాద స్థాయిల ఆధారంగా",

    // Profile
    name: "పేరు",
    email: "ఇమెయిల్",
    phone: "ఫోన్",
    save: "సేవ్ చేయండి",
    cancel: "రద్దు చేయండి",

    // Location
    currentLocation: "ప్రస్తుత స్థానం",
    autoDetectedLocation: "స్వయంచాలకంగా గుర్తించిన స్థానం",
    locationNotAvailable: "స్థానం అందుబాటులో లేదు",
    searchForCity: "నగరం కోసం వెతకండి...",
    search: "వెతకండి",
    searching: "వెతుకుతున్నాము...",
    coordinates: "కోఆర్డినేట్లు",
    detectedFromDevice: "మీ పరికరం స్థానం నుండి గుర్తించబడింది",
    loadingLocationData: "స్థాన డేటా లోడ్ చేస్తున్నాము...",

    // Priorities
    highPriority: "అధిక ప్రాధాన్యత",
    mediumPriority: "మధ్యమ ప్రాధాన్యత",
    lowPriority: "తక్కువ ప్రాధాన్యత",
  },

  hindi: {
    // Navigation
    dashboard: "डैशबोर्ड",
    disaster: "आपदा",
    location: "स्थान",
    settings: "सेटिंग्स",
    profile: "प्रोफाइल",
    selectLanguage: "भाषा चुनें",
    userProfile: "उपयोगकर्ता प्रोफाइल",

    // Dashboard
    climateRiskPrediction: "AI जलवायु जोखिम पूर्वानुमान",
    advancedForecasting:
      "बाढ़, गर्मी की लहर और प्रदूषण जोखिमों के लिए उन्नत पूर्वानुमान",
    climateRiskDashboard: "जलवायु जोखिम डैशबोर्ड",
    realTimeMonitoring: "रीयल-टाइम निगरानी और 7-दिन का पूर्वानुमान",
    refreshData: "डेटा रिफ्रेश करें",
    refreshing: "रिफ्रेश कर रहे हैं...",
    currentRiskAssessment: "वर्तमान जोखिम मूल्यांकन",
    currentConditions: "वर्तमान स्थितियां",
    floodRiskForecast: "बाढ़ जोखिम पूर्वानुमान",
    sevenDayAnalysis: "7-दिन की संभावना विश्लेषण",
    heatwavePrediction: "गर्मी की लहर का पूर्वानुमान",
    temperatureBasedRisk: "तापमान आधारित जोखिम मूल्यांकन",
    airQualityIndex: "वायु गुणवत्ता सूचकांक",
    pollutionLevelPredictions: "प्रदूषण स्तर पूर्वानुमान",
    emergencyContacts: "आपातकालीन संपर्क",
    emergencyNumbersFor: "आपातकालीन नंबर",
    importantNumbers: "जलवायु आपातकाल के लिए महत्वपूर्ण नंबर",
    recommendedActions: "अनुशंसित कार्य",
    actionsFor: "कार्य के लिए",
    basedOnCurrentConditions: "वर्तमान स्थितियों के आधार पर",
    basedOnCurrentRisk: "वर्तमान जोखिम स्तर के आधार पर",

    // Profile
    name: "नाम",
    email: "ईमेल",
    phone: "फोन",
    save: "सेव करें",
    cancel: "रद्द करें",

    // Location
    currentLocation: "वर्तमान स्थान",
    autoDetectedLocation: "स्वचालित रूप से पता लगाया गया स्थान",
    locationNotAvailable: "स्थान उपलब्ध नहीं",
    searchForCity: "शहर खोजें...",
    search: "खोजें",
    searching: "खोज रहे हैं...",
    coordinates: "निर्देशांक",
    detectedFromDevice: "आपके डिवाइस की स्थान से पता लगाया गया",
    loadingLocationData: "स्थान डेटा लोड कर रहे हैं...",

    // Priorities
    highPriority: "उच्च प्राथमिकता",
    mediumPriority: "मध्यम प्राथमिकता",
    lowPriority: "कम प्राथमिकता",
  },

  tamil: {
    // Navigation
    dashboard: "டேஷ்போர்டு",
    disaster: "பேரிடர்",
    location: "இடம்",
    settings: "அமைப்புகள்",
    profile: "சுயவிவரம்",
    selectLanguage: "மொழி தேர்ந்தெடுக்கவும்",
    userProfile: "பயனர் சுயவிவரம்",

    // Dashboard
    climateRiskPrediction: "AI காலநிலை ஆபத்து கணிப்பு",
    advancedForecasting:
      "வெள்ளம், வெப்பஅலை மற்றும் மாசுபாடு அபாயங்களுக்கான மேம்பட்ட கணிப்பு",
    climateRiskDashboard: "காலநிலை ஆபத்து டேஷ்போர்டு",
    realTimeMonitoring: "நிகழ்நேர கண்காணிப்பு மற்றும் 7-நாள் கணிப்புகள்",
    refreshData: "தரவை புதுப்பிக்கவும்",
    refreshing: "புதுப்பிக்கிறது...",
    currentRiskAssessment: "தற்போதைய ஆபத்து மதிப்பீடு",
    currentConditions: "தற்போதைய நிலைமைகள்",
    floodRiskForecast: "வெள்ள ஆபத்து கணிப்பு",
    sevenDayAnalysis: "7-நாள் நிகழ்தகவு பகுப்பாய்வு",
    heatwavePrediction: "வெப்பஅலை கணிப்பு",
    temperatureBasedRisk: "வெப்பநிலை அடிப்படையிலான ஆபத்து மதிப்பீடு",
    airQualityIndex: "காற்று தரக் குறியீடு",
    pollutionLevelPredictions: "மாசுபாடு நிலை கணிப்புகள்",
    emergencyContacts: "அவசரகால தொடர்புகள்",
    emergencyNumbersFor: "அவசரகால எண்கள்",
    importantNumbers: "காலநிலை அவசரநிலைகளுக்கான முக்கியமான எண்கள்",
    recommendedActions: "பரிந்துரைக்கப்பட்ட நடவடிக்கைகள்",
    actionsFor: "நடவடிக்கைகள்",
    basedOnCurrentConditions: "தற்போதைய நிலைமைகளின் அடிப்படையில்",
    basedOnCurrentRisk: "தற்போதைய ஆபத்து நிலைகளின் அடிப்படையில்",

    // Profile
    name: "பெயர்",
    email: "மின்னஞ்சல்",
    phone: "தொலைபேசி",
    save: "சேமிக்கவும்",
    cancel: "ரத்துசெய்",

    // Location
    currentLocation: "தற்போதைய இடம்",
    autoDetectedLocation: "தானாக கண்டறியப்பட்ட இடம்",
    locationNotAvailable: "இடம் கிடைக்கவில்லை",
    searchForCity: "நகரத்தைத் தேடவும்...",
    search: "தேடவும்",
    searching: "தேடுகிறது...",
    coordinates: "ஆயங்கள்",
    detectedFromDevice: "உங்கள் சாதன இடத்திலிருந்து கண்டறியப்பட்டது",
    loadingLocationData: "இட தரவு ஏற்றுகிறது...",

    // Priorities
    highPriority: "உயர் முன்னுரிமை",
    mediumPriority: "நடுத்தர முன்னுரிமை",
    lowPriority: "குறைந்த முன்னுரிமை",
  },

  malayalam: {
    // Navigation
    dashboard: "ഡാഷ്‌ബോർഡ്",
    disaster: "ദുരന്തം",
    location: "സ്ഥലം",
    settings: "ക്രമീകരണങ്ങൾ",
    profile: "പ്രൊഫൈൽ",
    selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    userProfile: "ഉപയോക്തൃ പ്രൊഫൈൽ",

    // Dashboard
    climateRiskPrediction: "AI കാലാവസ്ഥാ റിസ്ക് പ്രവചനം",
    advancedForecasting:
      "വെള്ളപ്പൊക്കം, ചൂട്ടലകൾ, മലിനീകരണ അപകടങ്ങൾക്കുള്ള വിപുലമായ പ്രവചനം",
    climateRiskDashboard: "കാലാവസ്ഥാ റിസ്ക് ഡാഷ്‌ബോർഡ്",
    realTimeMonitoring: "തത്സമയ നിരീക്ഷണവും 7-ദിവസ പ്രവചനങ്ങളും",
    refreshData: "ഡാറ്റ പുതുക്കുക",
    refreshing: "പുതുക്കുന്നു...",
    currentRiskAssessment: "നിലവിലെ റിസ്ക് വിലയിരുത്തൽ",
    currentConditions: "നിലവിലെ അവസ്ഥകൾ",
    floodRiskForecast: "വെള്ളപ്പൊക്ക റിസ്ക് പ്രവചനം",
    sevenDayAnalysis: "7-ദിവസ സാധ്യത വിശകലനം",
    heatwavePrediction: "ചൂട്ടലക പ്രവചനം",
    temperatureBasedRisk: "താപനില അടിസ്ഥാനമാക്കിയുള്ള റിസ്ക് വിലയിരുത്തൽ",
    airQualityIndex: "വായു ഗുണനിലവാര സൂചിക",
    pollutionLevelPredictions: "മലിനീകരണ തല പ്രവചനങ്ങൾ",
    emergencyContacts: "അടിയന്തിര കോൺടാക്റ്റുകൾ",
    emergencyNumbersFor: "അടിയന്തിര നമ്പറുകൾ",
    importantNumbers: "കാലാവസ്ഥാ അടിയന്തിരാവസ്ഥകൾക്കുള്ള പ്രധാന നമ്പറുകൾ",
    recommendedActions: "ശുപാർശ ചെയ്ത പ്രവർത്തനങ്ങൾ",
    actionsFor: "പ്രവർത്തനങ്ങൾക്കായി",
    basedOnCurrentConditions: "നിലവിലെ അവസ്ഥകളെ അടിസ്ഥാനമാക്കി",
    basedOnCurrentRisk: "നിലവിലെ റിസ്ക് ലെവലുകളെ അടിസ്ഥാനമാക്കി",

    // Profile
    name: "പേര്",
    email: "ഇമെയിൽ",
    phone: "ഫോൺ",
    save: "സേവ് ചെയ്യുക",
    cancel: "റദ്ദാക്കുക",

    // Location
    currentLocation: "നിലവിലെ സ്ഥലം",
    autoDetectedLocation: "സ്വയമേവ കണ്ടെത്തിയ സ്ഥലം",
    locationNotAvailable: "സ്ഥലം ലഭ്യമല്ല",
    searchForCity: "നഗരം തിരയുക...",
    search: "തിരയുക",
    searching: "തിരയുന്നു...",
    coordinates: "കോർഡിനേറ്റുകൾ",
    detectedFromDevice: "നിങ്ങളുടെ ഉപകരണ സ്ഥലത്തിൽ നിന്ന് കണ്ടെത്തി",
    loadingLocationData: "സ്ഥല ഡാറ്റ ലോഡ് ചെയ്യുന്നു...",

    // Priorities
    highPriority: "ഉയർന്ന മുൻഗണന",
    mediumPriority: "ഇടത്തരം മുൻഗണന",
    lowPriority: "കുറഞ്ഞ മുൻഗണന",
  },
};

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const { language } = useUser();

  const t = (key: string): string => {
    const currentTranslations =
      translations[language as keyof typeof translations];
    return (
      currentTranslations?.[key as keyof typeof currentTranslations] || key
    );
  };

  return (
    <TranslationContext.Provider value={{ t, language }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
