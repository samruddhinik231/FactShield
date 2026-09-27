const { OpenAI } = require('openai');
const axios = require('axios');
const puppeteer = require('puppeteer'); 




const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});


async function correctGrammar(content, language) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', 
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that corrects grammar in statements in ${language}.
                    Please correct any grammar errors and provide a polished version of the input statement.
                    Format the response with only the corrected statement.`,
        },
        {
          role: 'user',
          content: `Correct the grammar of the following content: "${content}"`,
        },
      ],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error correcting grammar:', error.message, error.stack);
    throw new Error('Grammar correction failed. Please check the API request or input data.');
  }
}


 async function validateContent(correctedContent, outputLanguage) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
            role: 'system',
            content: `You are an assistant that evaluates the truthfulness of statements in ${outputLanguage} and answers in ${outputLanguage}.
                      For each statement:
                      1. Determine whether the statement is true or false.
                      2. Provide the accuracy percentage of your confidence in the evaluation.
                      3. Include a brief and clear explanation of your reasoning or evidence for the accuracy.
                      
                      Format your response as follows:
                      - Title: "<Fixed topic title based on corrected content proper topic name  if this topic any specific person or specific object this object or person name as object maximun 2 words>"
                      - Statement: "<The input statement>"
                      - True/False/Partially True: <True/False/Partially True>
                      - Accuracy Percentage: <Percentage>
                      - Reasoning/Evidence: <Brief reasoning or evidence supporting the evaluation>
                      `,
        },
        {
            role: 'user',
            content: `Validate the statement: "${correctedContent}"`
        },
    ],
    });

    const validation = response.choices[0].message.content;
    console.log(validation);

    const titleRegex = /Title:\s*"(.*)"/;
    const trueFalseRegex = /True\/False\/Partially True:\s*(True|False|Partially True)/;
    const accuracyRegex = /Accuracy Percentage:\s*(\d+)%/;
    const evidenceRegex = /Reasoning\/Evidence:\s*(.*)/;
    const linksRegex = /Related Links:\s*(.*)/;

    const titleExtracted = validation.match(titleRegex)?.[1] || 'No title provided';
    const trueOrFalse = validation.match(trueFalseRegex)?.[1] || 'Unknown';
    const accuracy = validation.match(accuracyRegex)?.[1] || 'N/A';
    const evidence = validation.match(evidenceRegex)?.[1] || 'No evidence available';


    const relatedLinks = validation.match(linksRegex)?.[1]
      ? validation.match(linksRegex)[1]
          .split(/[, -]/) 
          .map(link => link.replace(/"/g, '').trim()) 
      : [];

    return {
      ValidationContent: validation,
      title: titleExtracted,
      statement: correctedContent,
      trueOrFalse,
      accuracy,
      evidence,
      relatedLinks,
    };
  } catch (error) {
    console.error('Error validating content:', error.message, error.stack);
    throw new Error('Validation failed. Please check the API request or input data.');
  }
}





module.exports = { correctGrammar, validateContent };
