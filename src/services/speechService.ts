export class SpeechService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isRecording: boolean = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
    
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
    }

    if (this.recognition) {
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
    }
  }

  startRecording(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    language: string = 'en-US'
  ): void {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser');
      return;
    }

    if (this.isRecording) {
      this.stopRecording();
    }

    this.recognition.lang = this.getLanguageCode(language);
    
    this.recognition.onresult = (event) => {
      let transcript = '';
      let isFinal = false;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          isFinal = true;
        }
      }

      onResult(transcript, isFinal);
    };

    this.recognition.onerror = (event) => {
      onError(`Speech recognition error: ${event.error}`);
    };

    this.recognition.onend = () => {
      this.isRecording = false;
    };

    this.recognition.start();
    this.isRecording = true;
  }

  stopRecording(): void {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    }
  }

  speak(text: string, language: string = 'en-US'): void {
    if (!this.synthesis) return;

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.getLanguageCode(language);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;

    this.synthesis.speak(utterance);
  }

  private getLanguageCode(language: string): string {
    const languageMap: { [key: string]: string } = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'te': 'te-IN',
      'mr': 'mr-IN',
      'ta': 'ta-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'pa': 'pa-IN'
    };

    return languageMap[language] || 'en-US';
  }

  isRecordingActive(): boolean {
    return this.isRecording;
  }

  // Analyze reading fluency (mock implementation)
  analyzeReadingFluency(transcript: string, expectedText: string): {
    fluency: number;
    pronunciation: number;
    struggledWords: string[];
    recommendations: string[];
  } {
    const words = transcript.toLowerCase().split(' ');
    const expectedWords = expectedText.toLowerCase().split(' ');
    
    let correctWords = 0;
    const struggledWords: string[] = [];

    expectedWords.forEach((expectedWord, index) => {
      if (words[index] && words[index] === expectedWord) {
        correctWords++;
      } else {
        struggledWords.push(expectedWord);
      }
    });

    const fluency = Math.round((correctWords / expectedWords.length) * 100);
    const pronunciation = Math.max(0, fluency - Math.random() * 20); // Mock pronunciation score

    const recommendations = [
      'Practice reading aloud daily',
      'Focus on difficult words',
      'Work on reading pace',
      'Use phonetic exercises'
    ];

    return {
      fluency,
      pronunciation: Math.round(pronunciation),
      struggledWords: struggledWords.slice(0, 5), // Limit to 5 words
      recommendations: recommendations.slice(0, 3)
    };
  }
}

export const speechService = new SpeechService();