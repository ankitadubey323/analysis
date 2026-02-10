
// import Groq from "groq-sdk";
// import { ca, is } from "zod/v4/locales";
// import dotenv from "dotenv";
// dotenv.config();

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// const MODEL = "llama-3.1-8b-instant";
// /**
//  * Generic function to call Groq AI
//  * Used by all analysis functions
//  * 
//  * @param {Array} messages - Array of message objects
//  * @param {Number} temperature - AI creativity (0-1, lower = more focused)
//  * @param {Number} maxTokens - Max response length
//  * @returns {String} AI response text
//  */
// // heres the calling of the groq ai only
// const callGroq = async (messages, temperature = 0.3, maxTokens = 1024) => {
//   try {
//     console.log("🤖 Calling Groq AI...");
// // sending request to the groq ai to analyze the content
//     const completion = await groq.chat.completions.create({
//       model: MODEL,
//       messages: messages,
//       temperature: temperature,
//       max_tokens: maxTokens,
//     });
// // receving response from the groq ai
//     const responseText =
//       completion.choices[0]?.message?.content || "";

//     console.log(" Response from Groq:", responseText);

//     return responseText;
//   } catch (error) {
//     console.error(" Error calling Groq:", error.message);
//     throw error;
//   }
// };

// // analysis krne ka logic yaha hoga or yaha pe db se data uthaya jayega jo saved hai user ka content wagreh
// const analyzeToxicity = async (text) => {
//     console.log("Analyzing content with Groq...");
//     const prompt=`You are a content moderation expert. Analyze this text for toxicity, hate speech, harassment, violence, or inappropriate content.

// Text to analyze:
// """
// ${text}
// """

// Respond ONLY with valid JSON (no markdown, no backticks, no extra text):
// {
//   "is_toxic": boolean,
//   "toxicity_score": number between 0-100,
//   "categories": array of strings (e.g., ["hate_speech", "harassment", "violence", "insult", "threat"]),
//   "severity": "low" | "medium" | "high" | "critical",
//   "explanation": string explaining why it's toxic or not
// }`;
// try{
//     const response = await callGroq([{ role: "user", content: prompt }], 0.5, 2048);
//     const cleandresponse=response
//     .replace(/```json/g, "")
//     .replace(/```/g, "")
//     .trim();

//     const result=parse.json(cleandresponse)
//     // const result = JSON.parse(cleandresponse);

//     console.log(`Toxicity analysis result: ${result.is_toxic} , Score: ${result.toxicity_score} , Categories: ${result.categories.join(", ")} , Severity: ${result.severity} , Explanation: ${result.explanation}`);
//     return result




// }catch(error){
//     console.error("Error analyzing content with Groq:", error.message);
//    const is_toxic=false
//    const toxicity_score=0
//    const categories=[]
//    const severity="low"
//    const explanation="Error analyzing content"
//    return {is_toxic,toxicity_score,categories,severity,explanation}



// }
// }
// // sentiment analysis ka logic bhi yaha hi hoga
// const analyzeSentiment = async (text) => {
//     console.log("Analyzing sentiment with Groq...");
//     const prompt=`Analyze the sentiment and emotional tone of this text.

// Text:
// """
// ${text}
// """

// Respond ONLY with valid JSON:
// {
//   "sentiment": "positive" | "negative" | "neutral" | "mixed",
//   "confidence": number between 0-1,
//   "emotions": array of strings (e.g., ["joy", "excitement", "anger", "frustration"]),
//   "tone": string describing overall tone
// }`;
// try{
//     const response = await callGroq([{ role: "user", content: prompt }], 0.5, 2048);
//     const cleandresponse=response
//     .replace(/```json/g, "")
//     .replace(/```/g, "")
//     .trim();
//     const result=parse.json(cleandresponse) 
//     console.log(`Sentiment analysis result: Sentiment: ${result.sentiment} , Confidence: ${result.confidence} , Emotions: ${result.emotions.join(", ")} , Tone: ${result.tone}`);
//     return result

// }catch(error){
//     console.error("Error analyzing sentiment with Groq:", error.message);
//     const sentiment="neutral"
//     const confidence=0
//     const emotions=[]
//     const tone="Error analyzing sentiment"
//     return {sentiment,confidence,emotions,tone}
// }
// }



// // text summarization ka logic bhi yaha hi hoga
// const summarizeText = async (text,length="short") => {
//     console.log("Summarizing text with Groq");
//    const lengthMap={
//     short:"1-2 sentences",
//     medium:"1-2 sentences",
//     long:"5-7sentences"
//    }
//    const prompt = `Summarize this text in ${lengthMap[length] || "1-2 sentences"}. Be concise and capture the main point.

// Text:
// """
// ${text}
// """

// Summary:`;
// try{
// const response=await callGroq(
//     [{
//         role:"user",
//         content:prompt
//     }],
//     0.5,
//     300   
// )

// const cleanedResponse = response
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//       const result = JSON.parse(cleanedResponse);
//     const keywords = result.keywords || [];


//     onsole.log(` Extracted ${keywords.length} keywords`);

//     return keywords;
//   } catch (error) {
//     console.error(" Keyword extraction failed:", error.message);
    
//     // Simple fallback: extract words longer than 4 characters
//     const words = text.split(/\s+/);
//     const maxKeywords = 10;
//     const longWords = words.filter(w => w.length > 4).slice(0, maxKeywords);
//     return longWords


  
// }
// }

// // language detection ka logic bhi yaha hi hoga
// const detectlanguage=async(text)=>{
//     console.log("Detecting language with Groq...");
//     const prompt=`Detect the language of this text. Respond with ONLY the ISO 639-1 language code (e.g., 'en' for English, 'es' for Spanish, 'fr' for French, 'hn' for hindi).

// Text:
// """
// ${text}
// """

// Language code:`;
// try{
//     const response =await callGroq([
//         {
//             role:"user",
//             content:prompt

//         }
//     ],0.1,10)
//     const languageCode=response.trim().toLowerCase();
//     console.log(`Detected language code: ${languageCode}`);
//     return languageCode

// }catch(error){
//     console.error("Error detecting language with Groq:", error.message);
//     return "en" // default to english if detection fails

// }
// }
// // keyword extraction ka logic
// const extractKeywords = async (text, maxKeywords = 10) => {
//   console.log("Extracting keywords with Groq...");

//   const prompt = `
// Extract the most important keywords from the following text.

// Text:
// """
// ${text}
// """

// Respond ONLY with valid JSON (no markdown, no extra text):
// {
//   "keywords": ["keyword1", "keyword2", "keyword3"]
// }
// `;

//   try {
//     const response = await callGroq(
//       [{ role: "user", content: prompt }],
//       0.3,
//       300
//     );

//     const cleanedResponse = response
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     const result = JSON.parse(cleanedResponse);

//     const keywords = (result.keywords || []).slice(0, maxKeywords);

//     console.log(` Extracted ${keywords.length} keywords`);
//     return keywords;

//   } catch (error) {
//     console.error("Keyword extraction failed:", error.message);

//     // fallback (basic keyword logic)
//     const words = text.split(/\s+/);
//     const longWords = words
//       .filter(w => w.length > 4)
//       .slice(0, maxKeywords);

//     return longWords;
//   }
// };

// // compherensive analysis ka logic bhi yaha hi hoga jisme sare analysis ek sath ho jayenge taki multiple calls na krne pade groq ko
// const analyzeContent=async(text)=>{
//     console.log("Performing comprehensive analysis with Groq...");
//      console.log(` Text length: ${text.length} characters`);
    
//       const startTime = Date.now();
    
//       try {
//         // Run ALL analyses in parallel (faster than sequential)
//         console.log(" Running 5 analyses in parallel...");
    
//         // const [
//         //   toxicityResult,
//         //   sentimentResult,
//         //   summaryText,
//         //   keywordsList,
//         //   languageCode,
//         // ] = await Promise.all([
//         //   analyzeToxicity(text),
//         //   analyzeSentiment(text),
//         //   summarize(text, "short"),
//         //   extractKeywords(text, 10),
//         //   detectLanguage(text),
//         // ]);

//         const [
//   toxicityResult,
//   sentimentResult,
//   summaryText,
//   languageCode,
// ] = await Promise.all([
//   analyzeToxicity(text),
//   analyzeSentiment(text),
//   summarizeText(text, "short"),
//   detectlanguage(text),
// ]);

    
//         const processingTime = Date.now() - startTime;
    
//         console.log(` All analyses complete in ${processingTime}ms`);
    
//         // Combine all results
//         const completeAnalysis = {
//           toxicity: toxicityResult,
//           sentiment: sentimentResult,
//           summary: summaryText,
//           keywords: keywordsList,
//           language: languageCode,
//           processingTime: processingTime,
//           model: MODEL,
//         };
    
//         // Log summary
//         console.log("\n Analysis Summary:");
//         console.log(`   Toxic: ${toxicityResult.is_toxic} (${toxicityResult.toxicity_score}/100)`);
//         console.log(`   Sentiment: ${sentimentResult.sentiment}`);
//         console.log(`   Language: ${languageCode}`);
//         console.log(`   Keywords: ${keywordsList.join(", ")}`);
//         console.log(`   Time: ${processingTime}ms\n`);
    
//         return completeAnalysis;
//       } catch (error) {
//         console.error(" Comprehensive analysis failed:", error);
//         throw error;
//       }
// }




// export default {
//   analyzeToxicity,
//   analyzeSentiment,
//   summarize: summarizeText,
//   extractKeywords,
//   detectLanguage: detectlanguage,
//   analyzeContent, // Main function
// };


// using the another versin of using parse n lil bit changing in the methode 
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama-3.1-8b-instant";

/* =======================
   GENERIC GROQ CALL
======================= */
const callGroq = async (messages, temperature = 0.3, maxTokens = 1024) => {
  try {
    console.log("🤖 Calling Groq AI...");

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    console.log(" Response from Groq:", responseText);

    return responseText;
  } catch (error) {
    console.error(" Error calling Groq:", error.message);
    throw error;
  }
};

/* =======================
   TOXICITY ANALYSIS
======================= */
const analyzeToxicity = async (text) => {
  console.log("Analyzing content with Groq...");

  const prompt = `
Analyze the following text for toxicity.

Text:
"""
${text}
"""

Respond ONLY with valid JSON:
{
  "is_toxic": boolean,
  "toxicity_score": number,
  "categories": [],
  "severity": "low" | "medium" | "high" | "critical",
  "explanation": string
}`;

  try {
    const response = await callGroq([{ role: "user", content: prompt }], 0.5, 2048);

    const cleaned = response.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    return result;
  } catch (error) {
    console.error("Toxicity parsing failed:", error.message);
    return {
      is_toxic: false,
      toxicity_score: 0,
      categories: [],
      severity: "low",
      explanation: "Parsing error",
    };
  }
};

/* =======================
   SENTIMENT ANALYSIS
======================= */
const analyzeSentiment = async (text) => {
  console.log("Analyzing sentiment with Groq...");

  const prompt = `
Analyze sentiment.

Text:
"""
${text}
"""

Respond ONLY with valid JSON:
{
  "sentiment": "positive" | "negative" | "neutral" | "mixed",
  "confidence": number,
  "emotions": [],
  "tone": string
}`;

  try {
    const response = await callGroq([{ role: "user", content: prompt }], 0.5, 2048);
    const cleaned = response.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Sentiment parsing failed:", error.message);
    return {
      sentiment: "neutral",
      confidence: 0,
      emotions: [],
      tone: "unknown",
    };
  }
};

/* =======================
   SUMMARY (TEXT ONLY)
======================= */
const summarizeText = async (text, length = "short") => {
  console.log("Summarizing text with Groq...");

  const lengthMap = {
    short: "1-2 sentences",
    medium: "3-4 sentences",
    long: "5-7 sentences",
  };

  const prompt = `
Summarize the following text in ${lengthMap[length]}.

Text:
"""
${text}
"""
`;

  try {
    const response = await callGroq([{ role: "user", content: prompt }], 0.4, 300);
    return response.trim();
  } catch (error) {
    console.error("Summary failed:", error.message);
    return "Summary unavailable";
  }
};

/* =======================
   LANGUAGE DETECTION
======================= */
const detectLanguage = async (text) => {
  console.log("Detecting language with Groq...");

  const prompt = `
Detect the language. Respond ONLY with ISO code.

Text:
"""
${text}
"""
`;

  try {
    const response = await callGroq([{ role: "user", content: prompt }], 0.1, 10);
    return response.trim().toLowerCase();
  } catch {
    return "en";
  }
};

/* =======================
   KEYWORD EXTRACTION
======================= */
const extractKeywords = async (text, maxKeywords = 10) => {
  console.log("Extracting keywords with Groq...");

  const prompt = `
Extract keywords.

Text:
"""
${text}
"""

Respond ONLY with valid JSON:
{
  "keywords": []
}
`;

  try {
    const response = await callGroq([{ role: "user", content: prompt }], 0.3, 300);
    const cleaned = response.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return (parsed.keywords || []).slice(0, maxKeywords);
  } catch (error) {
    console.error("Keyword parsing failed:", error.message);
    return text
      .split(/\s+/)
      .filter(w => w.length > 4)
      .slice(0, maxKeywords);
  }
};

/* =======================
   COMPREHENSIVE ANALYSIS
======================= */
const analyzeContent = async (text) => {
  console.log("Performing comprehensive analysis...");
  const start = Date.now();

  const [
    toxicityResult,
    sentimentResult,
    summaryText,
    keywordsList,
    languageCode,
  ] = await Promise.all([
    analyzeToxicity(text),
    analyzeSentiment(text),
    summarizeText(text, "short"),
    extractKeywords(text, 10),
    detectLanguage(text),
  ]);

  return {
    toxicity: toxicityResult,
    sentiment: sentimentResult,
    summary: summaryText,
    keywords: keywordsList,
    language: languageCode,
    processingTime: Date.now() - start,
    model: MODEL,
  };
};

/* =======================
   EXPORTS
======================= */
export default {
  analyzeToxicity,
  analyzeSentiment,
  summarize: summarizeText,
  extractKeywords,
  detectLanguage,
  analyzeContent,
};
