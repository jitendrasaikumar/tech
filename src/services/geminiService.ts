import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'demo-key');

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  private visionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

  async generateContent(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      return 'Error generating content. Please check your API key and try again.';
    }
  }

  async generateHyperLocalContent(
    contentType: string,
    topic: string,
    gradeLevel: string,
    localContext: string,
    language: string
  ): Promise<string> {
    const prompt = `
      Create a ${contentType} about "${topic}" for ${gradeLevel} students in ${language} language.
      
      Requirements:
      - Use local context: ${localContext}
      - Make it culturally relevant and relatable
      - Use simple, age-appropriate language
      - Include local examples and references
      - Make it engaging and educational
      
      Please provide the content in ${language} with proper formatting.
    `;

    return this.generateContent(prompt);
  }

  async generateDifferentiatedMaterials(
    topic: string,
    grades: string[],
    materialType: string,
    language: string
  ): Promise<{ [grade: string]: string }> {
    const results: { [grade: string]: string } = {};

    for (const grade of grades) {
      const prompt = `
        Create a ${materialType} for Grade ${grade} on the topic "${topic}" in ${language}.
        
        Requirements for Grade ${grade}:
        - Age-appropriate difficulty level
        - Relevant questions and activities
        - Clear instructions in ${language}
        - Include answer key if applicable
        
        Format as a complete ${materialType} ready for classroom use.
      `;

      results[grade] = await this.generateContent(prompt);
    }

    return results;
  }

  async answerStudentQuestion(
    question: string,
    gradeLevel: string,
    language: string
  ): Promise<string> {
    const prompt = `
      Answer this student question in ${language} for ${gradeLevel} level:
      "${question}"
      
      Requirements:
      - Use simple, clear language appropriate for ${gradeLevel}
      - Provide relatable examples and analogies
      - Make it engaging and easy to understand
      - Include practical applications if relevant
      - Keep the explanation concise but complete
    `;

    return this.generateContent(prompt);
  }

  async generateVisualAidDescription(
    description: string,
    subject: string,
    language: string
  ): Promise<string> {
    const prompt = `
      Create detailed instructions for drawing/creating a visual aid based on this description:
      "${description}"
      
      Subject: ${subject}
      Language: ${language}
      
      Provide:
      1. Step-by-step drawing instructions
      2. Labels and text in ${language}
      3. Key elements to include
      4. Suggested colors and layout
      5. Educational points to highlight
      
      Make it suitable for blackboard or simple drawing materials.
    `;

    return this.generateContent(prompt);
  }

  async generateEducationalGame(
    topic: string,
    gradeLevel: string,
    language: string
  ): Promise<string> {
    const prompt = `
      Create an interactive educational game about "${topic}" for ${gradeLevel} in ${language}.
      
      Include:
      1. Game name and objective
      2. Rules and instructions
      3. Questions or challenges (at least 10)
      4. Scoring system
      5. Materials needed (simple classroom items)
      6. Variations for different skill levels
      
      Make it engaging, educational, and easy to implement in a classroom setting.
    `;

    return this.generateContent(prompt);
  }

  async generateLessonPlan(
    subject: string,
    topic: string,
    gradeLevel: string,
    duration: string,
    language: string
  ): Promise<string> {
    const prompt = `
      Create a detailed lesson plan in ${language} for:
      Subject: ${subject}
      Topic: ${topic}
      Grade: ${gradeLevel}
      Duration: ${duration}
      
      Include:
      1. Learning objectives
      2. Materials needed
      3. Introduction activity (5-10 minutes)
      4. Main lesson content with activities
      5. Assessment methods
      6. Homework/follow-up activities
      7. Differentiation strategies
      8. Time allocation for each section
      
      Make it practical for rural classroom settings with limited resources.
    `;

    return this.generateContent(prompt);
  }

  async analyzeTextbookImage(imageData: string, instructions: string): Promise<string> {
    try {
      const prompt = `
        Analyze this textbook page image and ${instructions}
        
        Please provide a detailed analysis and follow the specific instructions given.
      `;

      const imagePart = {
        inlineData: {
          data: imageData.split(',')[1], // Remove data:image/jpeg;base64, prefix
          mimeType: 'image/jpeg'
        }
      };

      const result = await this.visionModel.generateContent([prompt, imagePart]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Vision API Error:', error);
      return 'Error analyzing image. Please try again.';
    }
  }
}

export const geminiService = new GeminiService();