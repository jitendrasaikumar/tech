import { geminiService } from './geminiService';

export interface Language {
  code: string;
  name: string;
  local: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', local: 'English' },
  { code: 'hi', name: 'Hindi', local: 'हिंदी' },
  { code: 'bn', name: 'Bengali', local: 'বাংলা' },
  { code: 'te', name: 'Telugu', local: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', local: 'मराठी' },
  { code: 'ta', name: 'Tamil', local: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', local: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', local: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', local: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', local: 'ਪੰਜਾਬੀ' }
];

export const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    features: 'AI Features',
    
    // Dashboard
    welcomeBack: 'Welcome back, Teacher!',
    readyToCreate: 'Ready to create amazing learning experiences?',
    quickActions: 'Quick Actions',
    recentActivities: 'Recent Activities',
    contentGenerated: 'Content Generated',
    studentsAssessed: 'Students Assessed',
    gamesCreated: 'Games Created',
    resourcesShared: 'Resources Shared',
    
    // Features
    hyperLocalContent: 'Hyper-Local Content',
    differentiatedMaterials: 'Differentiated Materials',
    instantKnowledge: 'Instant Knowledge Base',
    visualAids: 'Visual Aid Designer',
    readingAssessment: 'Reading Assessment',
    educationalGames: 'Educational Games',
    lessonPlanner: 'Weekly Lesson Planner',
    communitySharing: 'Community Sharing',
    
    // Content Generator
    contentType: 'Content Type',
    topic: 'Topic',
    gradeLevel: 'Grade Level',
    localContext: 'Local Context',
    generateContent: 'Generate Content',
    story: 'Story',
    poem: 'Poem',
    explanation: 'Explanation',
    example: 'Example',
    
    // Materials Creator
    uploadTextbook: 'Upload Textbook Page',
    targetGrades: 'Target Grades',
    materialType: 'Material Type',
    generateMaterials: 'Generate Materials',
    worksheet: 'Worksheet',
    quiz: 'Quiz',
    activity: 'Activity',
    summary: 'Summary',
    
    // Knowledge Base
    askQuestion: 'Ask a Question',
    studentName: 'Student Name',
    getAnswer: 'Get Answer',
    
    // Visual Aids
    visualDescription: 'Visual Description',
    subject: 'Subject',
    generateVisual: 'Generate Visual Aid',
    
    // Reading Assessment
    recordReading: 'Record Reading',
    startRecording: 'Start Recording',
    stopRecording: 'Stop Recording',
    assessmentResults: 'Assessment Results',
    readingFluency: 'Reading Fluency',
    pronunciation: 'Pronunciation',
    struggledWords: 'Struggled Words',
    recommendations: 'Recommendations',
    
    // Games
    generateGame: 'Generate Game',
    gameInstructions: 'Game Instructions',
    
    // Lesson Planner
    lessonDuration: 'Lesson Duration',
    generatePlan: 'Generate Lesson Plan',
    
    // Community
    shareResource: 'Share Resource',
    sharedResources: 'Shared Resources',
    filterResources: 'Filter Resources',
    allSubjects: 'All Subjects',
    allLanguages: 'All Languages',
    allGrades: 'All Grades',
    download: 'Download',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    close: 'Close',
    
    // Placeholders
    enterTopic: 'e.g., Water cycle, Local festivals, Math concepts',
    enterLocalContext: 'e.g., Village name, local landmarks, cultural elements',
    enterStudentName: 'Enter student name',
    enterQuestion: 'e.g., Why is the sky blue?',
    enterDescription: 'e.g., Draw a water cycle diagram with labels'
  },
  
  hi: {
    // Navigation
    dashboard: 'डैशबोर्ड',
    features: 'AI सुविधाएं',
    
    // Dashboard
    welcomeBack: 'वापसी पर स्वागत, शिक्षक!',
    readyToCreate: 'अद्भुत सीखने के अनुभव बनाने के लिए तैयार?',
    quickActions: 'त्वरित कार्य',
    recentActivities: 'हाल की गतिविधियां',
    contentGenerated: 'सामग्री उत्पन्न',
    studentsAssessed: 'छात्रों का मूल्यांकन',
    gamesCreated: 'खेल बनाए गए',
    resourcesShared: 'संसाधन साझा किए गए',
    
    // Features
    hyperLocalContent: 'स्थानीय सामग्री',
    differentiatedMaterials: 'विभेदित सामग्री',
    instantKnowledge: 'तत्काल ज्ञान आधार',
    visualAids: 'दृश्य सहायक डिजाइनर',
    readingAssessment: 'पठन मूल्यांकन',
    educationalGames: 'शैक्षिक खेल',
    lessonPlanner: 'साप्ताहिक पाठ योजनाकार',
    communitySharing: 'सामुदायिक साझाकरण',
    
    // Content Generator
    contentType: 'सामग्री प्रकार',
    topic: 'विषय',
    gradeLevel: 'कक्षा स्तर',
    localContext: 'स्थानीय संदर्भ',
    generateContent: 'सामग्री उत्पन्न करें',
    story: 'कहानी',
    poem: 'कविता',
    explanation: 'व्याख्या',
    example: 'उदाहरण',
    
    // Materials Creator
    uploadTextbook: 'पाठ्यपुस्तक पृष्ठ अपलोड करें',
    targetGrades: 'लक्षित कक्षाएं',
    materialType: 'सामग्री प्रकार',
    generateMaterials: 'सामग्री उत्पन्न करें',
    worksheet: 'कार्यपत्रक',
    quiz: 'प्रश्नोत्तरी',
    activity: 'गतिविधि',
    summary: 'सारांश',
    
    // Knowledge Base
    askQuestion: 'प्रश्न पूछें',
    studentName: 'छात्र का नाम',
    getAnswer: 'उत्तर प्राप्त करें',
    
    // Visual Aids
    visualDescription: 'दृश्य विवरण',
    subject: 'विषय',
    generateVisual: 'दृश्य सहायक उत्पन्न करें',
    
    // Reading Assessment
    recordReading: 'पठन रिकॉर्ड करें',
    startRecording: 'रिकॉर्डिंग शुरू करें',
    stopRecording: 'रिकॉर्डिंग बंद करें',
    assessmentResults: 'मूल्यांकन परिणाम',
    readingFluency: 'पठन प्रवाह',
    pronunciation: 'उच्चारण',
    struggledWords: 'कठिन शब्द',
    recommendations: 'सुझाव',
    
    // Games
    generateGame: 'खेल उत्पन्न करें',
    gameInstructions: 'खेल निर्देश',
    
    // Lesson Planner
    lessonDuration: 'पाठ अवधि',
    generatePlan: 'पाठ योजना उत्पन्न करें',
    
    // Community
    shareResource: 'संसाधन साझा करें',
    sharedResources: 'साझा संसाधन',
    filterResources: 'संसाधन फ़िल्टर करें',
    allSubjects: 'सभी विषय',
    allLanguages: 'सभी भाषाएं',
    allGrades: 'सभी कक्षाएं',
    download: 'डाउनलोड',
    
    // Common
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    close: 'बंद करें',
    
    // Placeholders
    enterTopic: 'जैसे, जल चक्र, स्थानीय त्योहार, गणित की अवधारणाएं',
    enterLocalContext: 'जैसे, गांव का नाम, स्थानीय स्थल, सांस्कृतिक तत्व',
    enterStudentName: 'छात्र का नाम दर्ज करें',
    enterQuestion: 'जैसे, आकाश नीला क्यों है?',
    enterDescription: 'जैसे, लेबल के साथ जल चक्र आरेख बनाएं'
  },
  
  te: {
    // Navigation
    dashboard: 'డాష్‌బోర్డ్',
    features: 'AI లక్షణాలు',
    
    // Dashboard
    welcomeBack: 'తిరిగి స్వాగతం, గురువుగారు!',
    readyToCreate: 'అద్భుతమైన అభ్యాస అనుభవాలను సృష్టించడానికి సిద్ధంగా ఉన్నారా?',
    quickActions: 'త్వరిత చర్యలు',
    recentActivities: 'ఇటీవలి కార్యకలాపాలు',
    contentGenerated: 'కంటెంట్ రూపొందించబడింది',
    studentsAssessed: 'విద్యార్థుల అంచనా',
    gamesCreated: 'ఆటలు సృష్టించబడ్డాయి',
    resourcesShared: 'వనరులు పంచుకోబడ్డాయి',
    
    // Features
    hyperLocalContent: 'స్థానిక కంటెంట్',
    differentiatedMaterials: 'వేరుచేసిన మెటీరియల్స్',
    instantKnowledge: 'తక్షణ జ్ఞాన స్థావరం',
    visualAids: 'దృశ్య సహాయక డిజైనర్',
    readingAssessment: 'పఠన అంచనా',
    educationalGames: 'విద్యా ఆటలు',
    lessonPlanner: 'వారపు పాఠ ప్రణాళిక',
    communitySharing: 'కమ్యూనిటీ షేరింగ్',
    
    // Content Generator
    contentType: 'కంటెంట్ రకం',
    topic: 'అంశం',
    gradeLevel: 'తరగతి స్థాయి',
    localContext: 'స్థానిక సందర్భం',
    generateContent: 'కంటెంట్ రూపొందించండి',
    story: 'కథ',
    poem: 'కవిత',
    explanation: 'వివరణ',
    example: 'ఉదాహరణ',
    
    // Materials Creator
    uploadTextbook: 'పాఠ్యపుస్తక పేజీని అప్‌లోడ్ చేయండి',
    targetGrades: 'లక్ష్య తరగతులు',
    materialType: 'మెటీరియల్ రకం',
    generateMaterials: 'మెటీరియల్స్ రూపొందించండి',
    worksheet: 'వర్క్‌షీట్',
    quiz: 'క్విజ్',
    activity: 'కార్యకలాపం',
    summary: 'సారాంశం',
    
    // Knowledge Base
    askQuestion: 'ప్రశ్న అడగండి',
    studentName: 'విద్యార్థి పేరు',
    getAnswer: 'సమాధానం పొందండి',
    
    // Visual Aids
    visualDescription: 'దృశ్య వివరణ',
    subject: 'విషయం',
    generateVisual: 'దృశ్య సహాయకం రూపొందించండి',
    
    // Reading Assessment
    recordReading: 'పఠనం రికార్డ్ చేయండి',
    startRecording: 'రికార్డింగ్ ప్రారంభించండి',
    stopRecording: 'రికార్డింగ్ ఆపండి',
    assessmentResults: 'అంచనా ఫలితాలు',
    readingFluency: 'పఠన ప్రవాహం',
    pronunciation: 'ఉచ్చారణ',
    struggledWords: 'కష్టపడిన పదాలు',
    recommendations: 'సిఫార్సులు',
    
    // Games
    generateGame: 'ఆట రూపొందించండి',
    gameInstructions: 'ఆట సూచనలు',
    
    // Lesson Planner
    lessonDuration: 'పాఠ వ్యవధి',
    generatePlan: 'పాఠ ప్రణాళిక రూపొందించండి',
    
    // Community
    shareResource: 'వనరు పంచుకోండి',
    sharedResources: 'పంచుకున్న వనరులు',
    filterResources: 'వనరులను ఫిల్టర్ చేయండి',
    allSubjects: 'అన్ని విషయాలు',
    allLanguages: 'అన్ని భాషలు',
    allGrades: 'అన్ని తరగతులు',
    download: 'డౌన్‌లోడ్',
    
    // Common
    loading: 'లోడ్ అవుతోంది...',
    error: 'లోపం',
    success: 'విజయం',
    cancel: 'రద్దు చేయండి',
    save: 'సేవ్ చేయండి',
    edit: 'సవరించండి',
    delete: 'తొలగించండి',
    close: 'మూసివేయండి',
    
    // Placeholders
    enterTopic: 'ఉదా., నీటి చక్రం, స్థానిక పండుగలు, గణిత భావనలు',
    enterLocalContext: 'ఉదా., గ్రామం పేరు, స్థానిక ప్రదేశాలు, సాంస్కృతిక అంశాలు',
    enterStudentName: 'విద్యార్థి పేరు నమోదు చేయండి',
    enterQuestion: 'ఉదా., ఆకాశం ఎందుకు నీలంగా ఉంటుంది?',
    enterDescription: 'ఉదా., లేబుల్స్‌తో నీటి చక్రం రేఖాచిత్రం గీయండి'
  }
};

export class TranslationService {
  private currentLanguage: string = 'en';

  setLanguage(languageCode: string) {
    this.currentLanguage = languageCode;
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  translate(key: string): string {
    const languageTranslations = translations[this.currentLanguage as keyof typeof translations];
    return languageTranslations?.[key as keyof typeof languageTranslations] || key;
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    if (targetLanguage === 'en') return text;
    
    const languageName = languages.find(lang => lang.code === targetLanguage)?.name || targetLanguage;
    
    const prompt = `Translate the following text to ${languageName}. Only provide the translation, no additional text:

"${text}"`;

    return await geminiService.generateContent(prompt);
  }
}

export const translationService = new TranslationService();