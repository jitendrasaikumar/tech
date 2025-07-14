import React, { useState, useRef } from 'react';
import { 
  BookOpen, 
  Users, 
  MessageSquare, 
  Image, 
  Mic, 
  Gamepad2, 
  Calendar, 
  Share2,
  Globe,
  Upload,
  Download,
  Play,
  Square,
  Star,
  Filter,
  Search,
  ChevronDown,
  Loader,
  CheckCircle,
  AlertCircle,
  Volume2,
  FileText,
  PenTool,
  Brain,
  Lightbulb
} from 'lucide-react';
import { geminiService } from './services/geminiService';
import { translationService, languages } from './services/translationService';
import { speechService } from './services/speechService';
import { fileService } from './services/fileService';
import { useTranslation } from './hooks/useTranslation';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';

interface Feature {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

const features: Feature[] = [
  { id: 'hyperLocalContent', icon: BookOpen, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { id: 'differentiatedMaterials', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { id: 'instantKnowledge', icon: MessageSquare, color: 'text-green-600', bgColor: 'bg-green-50' },
  { id: 'visualAids', icon: Image, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { id: 'readingAssessment', icon: Mic, color: 'text-red-600', bgColor: 'bg-red-50' },
  { id: 'educationalGames', icon: Gamepad2, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  { id: 'lessonPlanner', icon: Calendar, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  { id: 'communitySharing', icon: Share2, color: 'text-pink-600', bgColor: 'bg-pink-50' }
];

const gradeOptions = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'];
const subjectOptions = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Environmental Studies'];

function App() {
  const { currentLanguage, changeLanguage, t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Content Generator State
  const [contentForm, setContentForm] = useState({
    contentType: 'story',
    topic: '',
    gradeLevel: 'Grade 3',
    localContext: ''
  });
  const [generatedContent, setGeneratedContent] = useState('');

  // Materials Creator State
  const [materialsForm, setMaterialsForm] = useState({
    targetGrades: ['Grade 3'],
    materialType: 'worksheet',
    uploadedImage: null as File | null
  });
  const [generatedMaterials, setGeneratedMaterials] = useState<{[grade: string]: string}>({});

  // Knowledge Base State
  const [knowledgeForm, setKnowledgeForm] = useState({
    question: '',
    studentName: '',
    gradeLevel: 'Grade 3'
  });
  const [knowledgeAnswer, setKnowledgeAnswer] = useState('');

  // Visual Aids State
  const [visualForm, setVisualForm] = useState({
    description: '',
    subject: 'Science'
  });
  const [visualInstructions, setVisualInstructions] = useState('');

  // Reading Assessment State
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assessmentResults, setAssessmentResults] = useState<any>(null);
  const expectedText = "The quick brown fox jumps over the lazy dog. This is a sample text for reading assessment.";

  // Games State
  const [gameForm, setGameForm] = useState({
    topic: '',
    gradeLevel: 'Grade 3'
  });
  const [generatedGame, setGeneratedGame] = useState('');

  // Lesson Planner State
  const [lessonForm, setLessonForm] = useState({
    subject: 'Science',
    topic: '',
    gradeLevel: 'Grade 3',
    duration: '45 minutes'
  });
  const [generatedLesson, setGeneratedLesson] = useState('');

  // Community State
  const [communityResources, setCommunityResources] = useState([
    {
      id: 1,
      title: 'Water Cycle Worksheet',
      subject: 'Science',
      grade: 'Grade 4',
      language: 'English',
      author: 'Teacher Priya',
      rating: 4.5,
      downloads: 234
    },
    {
      id: 2,
      title: 'गणित के खेल',
      subject: 'Mathematics',
      grade: 'Grade 2',
      language: 'Hindi',
      author: 'Teacher Raj',
      rating: 4.8,
      downloads: 156
    }
  ]);
  const [communityFilters, setCommunityFilters] = useState({
    subject: 'allSubjects',
    language: 'allLanguages',
    grade: 'allGrades'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Content Generator Functions
  const handleGenerateContent = async () => {
    if (!contentForm.topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const content = await geminiService.generateHyperLocalContent(
        contentForm.contentType,
        contentForm.topic,
        contentForm.gradeLevel,
        contentForm.localContext,
        currentLanguage
      );
      setGeneratedContent(content);
    } catch (err) {
      setError('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Materials Creator Functions
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!fileService.validateImageFile(file)) {
      setError('Please upload a valid image file (JPEG, PNG, WebP) under 10MB');
      return;
    }

    setMaterialsForm(prev => ({ ...prev, uploadedImage: file }));
  };

  const handleGenerateMaterials = async () => {
    if (!materialsForm.uploadedImage) {
      setError('Please upload a textbook page image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const imageData = await fileService.compressImage(materialsForm.uploadedImage);
      const instructions = `Create ${materialsForm.materialType} for grades ${materialsForm.targetGrades.join(', ')} based on this textbook page`;
      
      const analysis = await geminiService.analyzeTextbookImage(imageData, instructions);
      
      const materials = await geminiService.generateDifferentiatedMaterials(
        analysis,
        materialsForm.targetGrades,
        materialsForm.materialType,
        currentLanguage
      );
      
      setGeneratedMaterials(materials);
    } catch (err) {
      setError('Failed to generate materials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Knowledge Base Functions
  const handleGetAnswer = async () => {
    if (!knowledgeForm.question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const answer = await geminiService.answerStudentQuestion(
        knowledgeForm.question,
        knowledgeForm.gradeLevel,
        currentLanguage
      );
      setKnowledgeAnswer(answer);
    } catch (err) {
      setError('Failed to get answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakAnswer = () => {
    if (knowledgeAnswer) {
      speechService.speak(knowledgeAnswer, currentLanguage);
    }
  };

  // Visual Aids Functions
  const handleGenerateVisual = async () => {
    if (!visualForm.description.trim()) {
      setError('Please enter a visual description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const instructions = await geminiService.generateVisualAidDescription(
        visualForm.description,
        visualForm.subject,
        currentLanguage
      );
      setVisualInstructions(instructions);
    } catch (err) {
      setError('Failed to generate visual aid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reading Assessment Functions
  const handleStartRecording = () => {
    setIsRecording(true);
    setTranscript('');
    setAssessmentResults(null);
    
    speechService.startRecording(
      (transcript, isFinal) => {
        setTranscript(transcript);
        if (isFinal) {
          const results = speechService.analyzeReadingFluency(transcript, expectedText);
          setAssessmentResults(results);
          setIsRecording(false);
        }
      },
      (error) => {
        setError(error);
        setIsRecording(false);
      },
      currentLanguage
    );
  };

  const handleStopRecording = () => {
    speechService.stopRecording();
    setIsRecording(false);
    
    if (transcript) {
      const results = speechService.analyzeReadingFluency(transcript, expectedText);
      setAssessmentResults(results);
    }
  };

  // Games Functions
  const handleGenerateGame = async () => {
    if (!gameForm.topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const game = await geminiService.generateEducationalGame(
        gameForm.topic,
        gameForm.gradeLevel,
        currentLanguage
      );
      setGeneratedGame(game);
    } catch (err) {
      setError('Failed to generate game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Lesson Planner Functions
  const handleGenerateLesson = async () => {
    if (!lessonForm.topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const lesson = await geminiService.generateLessonPlan(
        lessonForm.subject,
        lessonForm.topic,
        lessonForm.gradeLevel,
        lessonForm.duration,
        currentLanguage
      );
      setGeneratedLesson(lesson);
    } catch (err) {
      setError('Failed to generate lesson plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Download Functions
  const handleDownload = (content: string, filename: string) => {
    fileService.downloadText(content, filename);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">{t('welcomeBack')}</h2>
        <p className="opacity-90">{t('readyToCreate')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('contentGenerated')}</p>
              <p className="text-2xl font-bold text-orange-600">127</p>
            </div>
            <BookOpen className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('studentsAssessed')}</p>
              <p className="text-2xl font-bold text-blue-600">89</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('gamesCreated')}</p>
              <p className="text-2xl font-bold text-green-600">34</p>
            </div>
            <Gamepad2 className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('resourcesShared')}</p>
              <p className="text-2xl font-bold text-purple-600">56</p>
            </div>
            <Share2 className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">{t('quickActions')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.slice(0, 4).map((feature) => {
            const IconComponent = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-orange-300 transition-colors text-center group`}
              >
                <IconComponent className={`w-8 h-8 mx-auto mb-2 ${feature.color} group-hover:scale-110 transition-transform`} />
                <p className="text-sm font-medium">{t(feature.id)}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderHyperLocalContent = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-orange-600" />
          {t('hyperLocalContent')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('contentType')}</label>
            <select
              value={contentForm.contentType}
              onChange={(e) => setContentForm(prev => ({ ...prev, contentType: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="story">{t('story')}</option>
              <option value="poem">{t('poem')}</option>
              <option value="explanation">{t('explanation')}</option>
              <option value="example">{t('example')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('gradeLevel')}</label>
            <select
              value={contentForm.gradeLevel}
              onChange={(e) => setContentForm(prev => ({ ...prev, gradeLevel: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              {gradeOptions.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{t('topic')}</label>
          <input
            type="text"
            value={contentForm.topic}
            onChange={(e) => setContentForm(prev => ({ ...prev, topic: e.target.value }))}
            placeholder={t('enterTopic')}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{t('localContext')}</label>
          <input
            type="text"
            value={contentForm.localContext}
            onChange={(e) => setContentForm(prev => ({ ...prev, localContext: e.target.value }))}
            placeholder={t('enterLocalContext')}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <button
          onClick={handleGenerateContent}
          disabled={loading}
          className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? <LoadingSpinner size="sm" text="" /> : <Brain className="w-5 h-5 mr-2" />}
          {t('generateContent')}
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => setError('')} />}

      {generatedContent && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Generated Content</h4>
            <button
              onClick={() => handleDownload(generatedContent, `content-${Date.now()}.txt`)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('download')}
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {generatedContent}
          </div>
        </div>
      )}
    </div>
  );

  const renderDifferentiatedMaterials = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-600" />
          {t('differentiatedMaterials')}
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{t('uploadTextbook')}</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Click to upload textbook page image</p>
            <p className="text-sm text-gray-500 mt-2">Supports JPEG, PNG, WebP (max 10MB)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          {materialsForm.uploadedImage && (
            <p className="mt-2 text-sm text-green-600">
              ✓ {materialsForm.uploadedImage.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('targetGrades')}</label>
            <select
              multiple
              value={materialsForm.targetGrades}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setMaterialsForm(prev => ({ ...prev, targetGrades: values }));
              }}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
            >
              {gradeOptions.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('materialType')}</label>
            <select
              value={materialsForm.materialType}
              onChange={(e) => setMaterialsForm(prev => ({ ...prev, materialType: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="worksheet">{t('worksheet')}</option>
              <option value="quiz">{t('quiz')}</option>
              <option value="activity">{t('activity')}</option>
              <option value="summary">{t('summary')}</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateMaterials}
          disabled={loading || !materialsForm.uploadedImage}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? <LoadingSpinner size="sm" text="" /> : <PenTool className="w-5 h-5 mr-2" />}
          {t('generateMaterials')}
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => setError('')} />}

      {Object.keys(generatedMaterials).length > 0 && (
        <div className="space-y-4">
          {Object.entries(generatedMaterials).map(([grade, content]) => (
            <div key={grade} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">{grade} Material</h4>
                <button
                  onClick={() => handleDownload(content, `${grade}-material-${Date.now()}.txt`)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('download')}
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap max-h-64 overflow-y-auto">
                {content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderInstantKnowledge = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
          {t('instantKnowledge')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('studentName')}</label>
            <input
              type="text"
              value={knowledgeForm.studentName}
              onChange={(e) => setKnowledgeForm(prev => ({ ...prev, studentName: e.target.value }))}
              placeholder={t('enterStudentName')}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('gradeLevel')}</label>
            <select
              value={knowledgeForm.gradeLevel}
              onChange={(e) => setKnowledgeForm(prev => ({ ...prev, gradeLevel: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              {gradeOptions.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{t('askQuestion')}</label>
          <textarea
            value={knowledgeForm.question}
            onChange={(e) => setKnowledgeForm(prev => ({ ...prev, question: e.target.value }))}
            placeholder={t('enterQuestion')}
            rows={3}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          onClick={handleGetAnswer}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? <LoadingSpinner size="sm" text="" /> : <Lightbulb className="w-5 h-5 mr-2" />}
          {t('getAnswer')}
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => setError('')} />}

      {knowledgeAnswer && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Answer for {knowledgeForm.studentName || 'Student'}</h4>
            <div className="flex space-x-2">
              <button
                onClick={handleSpeakAnswer}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Speak
              </button>
              <button
                onClick={() => handleDownload(knowledgeAnswer, `answer-${Date.now()}.txt`)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                {t('download')}
              </button>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {knowledgeAnswer}
          </div>
        </div>
      )}
    </div>
  );

  const renderVisualAids = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Image className="w-5 h-5 mr-2 text-purple-600" />
          {t('visualAids')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('subject')}</label>
            <select
              value={visualForm.subject}
              onChange={(e) => setVisualForm(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {subjectOptions.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{t('visualDescription')}</label>
          <textarea
            value={visualForm.description}
            onChange={(e) => setVisualForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder={t('enterDescription')}
            rows={3}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          onClick={handleGenerateVisual}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? <LoadingSpinner size="sm" text="" /> : <Image className="w-5 h-5 mr-2" />}
          {t('generateVisual')}
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => setError('')} />}

      {visualInstructions && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Visual Aid Instructions</h4>
            <button
              onClick={() => handleDownload(visualInstructions, `visual-aid-${Date.now()}.txt`)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('download')}
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {visualInstructions}
          </div>
        </div>
      )}
    </div>
  );

  const renderReadingAssessment = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Mic className="w-5 h-5 mr-2 text-red-600" />
          {t('readingAssessment')}
        </h3>

        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h4 className="font-medium mb-2">Sample Text to Read:</h4>
          <p className="text-gray-700">{expectedText}</p>
        </div>

        <div className="flex justify-center mb-4">
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`px-8 py-4 rounded-full text-white font-medium flex items-center ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-5 h-5 mr-2" />
                {t('stopRecording')}
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                {t('startRecording')}
              </>
            )}
          </button>
        </div>

        {transcript && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium mb-2">Recorded Text:</h4>
            <p className="text-gray-700">{transcript}</p>
          </div>
        )}
      </div>

      {error && <ErrorMessage message={error} onRetry={() => setError('')} />}

      {assessmentResults && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="text-lg font-semibold mb-4">{t('assessmentResults')}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium text-green-800">{t('readingFluency')}</h5>
              <p className="text-2xl font-bold text-green-600">{assessmentResults.fluency}%</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-800">{t('pronunciation')}</h5>
              <p className="text-2xl font-bold text-blue-600">{assessmentResults.pronunciation}%</p>
            </div>
          </div>

          {assessmentResults.struggledWords.length > 0 && (
            <div className="mb-4">
              <h5 className="font-medium mb-2">{t('struggledWords')}</h5>
              <div className="flex flex-wrap gap-2">
                {assessmentResults.struggledWords.map((word: string, index: number) => (
                  <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h5 className="font-medium mb-2">{t('recommendations')}</h5>
            <ul className="list-disc list-inside space-y-1">
              {assessmentResults.recommendations.map((rec: string, index: number) => (
                <li key={index} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  const renderEducationalGames = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Gamepad2 className="w-5 h-5 mr-2 text-indigo-600" />
          {t('educationalGames')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('topic')}</label>
            <input
              type="text"
              value={gameForm.topic}
              onChange={(e) => setGameForm(prev => ({ ...prev, topic: e.target.value }))}
              placeholder={t('enterTopic')}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('gradeLevel')}</label>
            <select
              value={gameForm.gradeLevel}
              onChange={(e) => setGameForm(prev => ({ ...prev, gradeLevel: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {gradeOptions.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateGame}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? <LoadingSpinner size="sm" text="" /> : <Gamepad2 className="w-5 h-5 mr-2" />}
          {t('generateGame')}
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => setError('')} />}

      {generatedGame && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">{t('gameInstructions')}</h4>
            <button
              onClick={() => handleDownload(generatedGame, `game-${Date.now()}.txt`)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('download')}
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {generatedGame}
          </div>
        </div>
      )}
    </div>
  );

  const renderLessonPlanner = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-yellow-600" />
          {t('lessonPlanner')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('subject')}</label>
            <select
              value={lessonForm.subject}
              onChange={(e) => setLessonForm(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500"
            >
              {subjectOptions.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('gradeLevel')}</label>
            <select
              value={lessonForm.gradeLevel}
              onChange={(e) => setLessonForm(prev => ({ ...prev, gradeLevel: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500"
            >
              {gradeOptions.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('topic')}</label>
            <input
              type="text"
              value={lessonForm.topic}
              onChange={(e) => setLessonForm(prev => ({ ...prev, topic: e.target.value }))}
              placeholder={t('enterTopic')}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('lessonDuration')}</label>
            <select
              value={lessonForm.duration}
              onChange={(e) => setLessonForm(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500"
            >
              <option value="30 minutes">30 minutes</option>
              <option value="45 minutes">45 minutes</option>
              <option value="60 minutes">60 minutes</option>
              <option value="90 minutes">90 minutes</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateLesson}
          disabled={loading}
          className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? <LoadingSpinner size="sm" text="" /> : <Calendar className="w-5 h-5 mr-2" />}
          {t('generatePlan')}
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => setError('')} />}

      {generatedLesson && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Lesson Plan</h4>
            <button
              onClick={() => handleDownload(generatedLesson, `lesson-plan-${Date.now()}.txt`)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('download')}
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap max-h-96 overflow-y-auto">
            {generatedLesson}
          </div>
        </div>
      )}
    </div>
  );

  const renderCommunitySharing = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Share2 className="w-5 h-5 mr-2 text-pink-600" />
          {t('communitySharing')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Subject</label>
            <select
              value={communityFilters.subject}
              onChange={(e) => setCommunityFilters(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              <option value="allSubjects">{t('allSubjects')}</option>
              {subjectOptions.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Language</label>
            <select
              value={communityFilters.language}
              onChange={(e) => setCommunityFilters(prev => ({ ...prev, language: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              <option value="allLanguages">{t('allLanguages')}</option>
              {languages.map(lang => (
                <option key={lang.code} value={lang.name}>{lang.local}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Grade</label>
            <select
              value={communityFilters.grade}
              onChange={(e) => setCommunityFilters(prev => ({ ...prev, grade: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              <option value="allGrades">{t('allGrades')}</option>
              {gradeOptions.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {communityResources.map(resource => (
            <div key={resource.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-lg">{resource.title}</h4>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  <span className="text-sm">{resource.rating}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {resource.subject}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  {resource.grade}
                </span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                  {resource.language}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <p>By {resource.author}</p>
                  <p>{resource.downloads} downloads</p>
                </div>
                <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  {t('download')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'hyperLocalContent':
        return renderHyperLocalContent();
      case 'differentiatedMaterials':
        return renderDifferentiatedMaterials();
      case 'instantKnowledge':
        return renderInstantKnowledge();
      case 'visualAids':
        return renderVisualAids();
      case 'readingAssessment':
        return renderReadingAssessment();
      case 'educationalGames':
        return renderEducationalGames();
      case 'lessonPlanner':
        return renderLessonPlanner();
      case 'communitySharing':
        return renderCommunitySharing();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold text-gray-900">Smart Sahayak</h1>
                <p className="text-sm text-gray-500">AI Teaching Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={currentLanguage}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.local}
                    </option>
                  ))}
                </select>
                <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm border p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-orange-50 text-orange-700 border border-orange-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  {t('dashboard')}
                </button>
                
                <div className="pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {t('features')}
                  </p>
                  {features.map((feature) => {
                    const IconComponent = feature.icon;
                    return (
                      <button
                        key={feature.id}
                        onClick={() => setActiveTab(feature.id)}
                        className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                          activeTab === feature.id
                            ? `${feature.bgColor} ${feature.color} border border-current border-opacity-20`
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent className="w-5 h-5 mr-3" />
                        <span className="text-sm">{t(feature.id)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;