import React, { useState } from 'react';

// Main App Component
export default function App() {
  const [docType, setDocType] = useState('Policy');
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Helper Functions ---

  /**
   * Constructs a detailed prompt for the Gemini API based on user input.
   * @param {string} type - The type of document to generate.
   * @param {string} inputTopic - The user-provided topic.
   * @returns {string} A formatted prompt for the AI.
   */
  const createPrompt = (type, inputTopic) => {
    let prompt = `As an expert in local governance and community development for "BANGKEROS" (boatmen/women), generate a comprehensive "${type}" document.`;
    prompt += `\n\nThe topic is: "${inputTopic}".\n\n`;

    switch (type) {
      case 'Policy':
        prompt += 'The policy should include the following sections clearly marked with headings: \n1. **Title:** \n2. **Introduction/Preamble:** (Background and rationale) \n3. **Policy Statement:** (The core rules and principles) \n4. **Scope:** (Who and what this policy applies to) \n5. **Procedures:** (Step-by-step implementation guidelines) \n6. **Responsibilities:** (Specific roles and duties) \n7. **Effectivity Date:**';
        break;
      case 'Resolution':
        prompt += 'The resolution should be formal, suitable for adoption by an association or local council. It must include: \n1. **Resolution Title:** \n2. **Preamble/Whereas Clauses:** (Stating the reasons for the resolution) \n3. **Resolved Clauses:** (The main actions or declarations) \n4. **Adoption Details:** (Date and signatories)';
        break;
      case 'Project':
        prompt += 'The project proposal should be detailed and persuasive. It must include: \n1. **Project Title:** \n2. **Project Proponent/s:** \n3. **Project Rationale:** (The problem the project addresses) \n4. **Objectives:** (Specific, Measurable, Achievable, Relevant, Time-bound - SMART) \n5. **Target Beneficiaries:** \n6. **Implementation Plan/Timeline:** (Key activities and schedule) \n7. **Budgetary Requirements:** (Estimated breakdown of costs) \n8. **Monitoring and Evaluation:** (How success will be measured)';
        break;
      case 'Program':
        prompt += 'The program document should outline a long-term initiative. It must include: \n1. **Program Title:** \n2. **Vision and Mission:** \n3. **Goals and Objectives:** \n4. **Key Components/Projects:** (A list of projects under the program) \n5. **Target Audience:** \n6. **Governance Structure:** \n7. **Overall Budget and Funding Strategy:**';
        break;
      case 'Activity':
        prompt += 'The activity plan should be practical and easy to follow. It must include: \n1. **Activity Name:** \n2. **Date, Time, and Venue:** \n3. **Objective/s of the Activity:** \n4. **Participants:** \n5. **Schedule of Activities/Program Flow:** \n6. **Needed Resources/Logistics:** \n7. **Person/s in Charge:**';
        break;
      default:
        prompt = `Generate a document about "${inputTopic}" of type "${type}".`;
    }
    prompt += "\n\nEnsure the language is professional, clear, and appropriate for the context of Filipino BANGKEROS.";
    return prompt;
  };

  /**
   * Handles the generation of content by calling the Gemini API.
   */
  const handleGenerate = async () => {
    if (!topic) {
      setError('Please enter a topic to generate the document.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedContent('');

    const prompt = createPrompt(docType, topic);
    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = ""; // API key is handled by the environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setGeneratedContent(text.replace(/\n/g, '<br />')); // Replace newlines with <br> for HTML rendering
      } else {
        throw new Error('Unexpected API response structure.');
      }
    } catch (err) {
      setError(`An error occurred: ${err.message}. Please try again.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
   /**
   * Copies the generated text to the clipboard.
   */
  const handleCopyToClipboard = () => {
    const textToCopy = generatedContent.replace(/<br \/>/g, '\n'); // Convert back to plain text
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        alert('Copied to clipboard!');
    } catch (err) {
        alert('Failed to copy text.');
    }
    document.body.removeChild(textArea);
  };


  // --- Render ---
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 shadow-md">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold">BANGKERO's Policy & Project Generator</h1>
          <p className="mt-2 text-blue-100">AI-Powered Document Generation for Community Initiatives</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto max-w-5xl p-4 md:p-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create a New Document</h2>
          
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-1">
              <label htmlFor="docType" className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
              <select
                id="docType"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option>Policy</option>
                <option>Resolution</option>
                <option>Project</option>
                <option>Program</option>
                <option>Activity</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                Topic / Subject Matter
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., 'Tourist Safety and Fair Pricing', 'Coastal Clean-up Drive'"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </div>
              ) : 'Generate Document'}
            </button>
          </div>
           {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>

        {/* Output Section */}
        <div className="mt-6">
          {(isLoading || generatedContent) && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-2xl font-semibold text-gray-800">Generated {docType}</h3>
                 {generatedContent && !isLoading && (
                    <button 
                        onClick={handleCopyToClipboard}
                        className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                    >
                        Copy Text
                    </button>
                 )}
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                        <p className="text-gray-600 mt-4">Generating your document... Please wait.</p>
                    </div>
                </div>
              ) : (
                <div 
                  className="prose max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: generatedContent }}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-4 mt-8">
        <p>&copy; {new Date().getFullYear()} BANGKERO's Generator. Powered by Gemini.</p>
      </footer>
    </div>
  );
}