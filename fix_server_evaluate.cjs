const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const replacementCode = `
      // Check if user already provided edited text
      const userTranscribedText = req.body.transcribedText;
      const mimeType = file.mimetype;
      let imagePart = { text: '' };
      let wordCount = 0;
      let sentenceCount = 0;

      if (mimeType.startsWith('image/')) {
        const simpleKey = req.headers['x-simple-ocr-key'];
        const formattedKey = req.headers['x-formatted-ocr-key'];
        const ocrType = req.headers['x-ocr-type'] || 'simple';
        
        // Use user text if available, otherwise do OCR
        const extractedText = userTranscribedText 
          ? userTranscribedText 
          : await extractTextFromImage(file.buffer, mimeType, ocrType, simpleKey, formattedKey);
           
        // OCR text often contains arbitrary line breaks per line of text.
        // This causes Intl.Segmenter to artificially count every line as a new sentence.
        // We replace all newlines with spaces purely for counting purposes to get an accurate linguistic count.
        const textForCounting = extractedText.replace(/\\n+/g, ' ');

        const wordSegmenter = new Intl.Segmenter('en', { granularity: 'word' });
        wordCount = Array.from(wordSegmenter.segment(textForCounting)).filter(s => s.isWordLike).length;
           
        const sentenceSegmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
        sentenceCount = Array.from(sentenceSegmenter.segment(textForCounting)).filter(s => s.segment.trim().length > 0).length;

        imagePart = { text: \`[Extracted Homework Answer via \${ocrType} OCR]:\\n\${extractedText}\\n\\n[System Metrics]:\\n- Word Count: \${wordCount}\\n- Sentence Count: \${sentenceCount}\` };
      } else {
         throw new Error('Only images are supported for evaluation.');
      }
`;

code = code.replace(
  /\/\/ Convert multer buffer to base64[\s\S]*?throw new Error\('Only images are supported for evaluation\.'\);\n\s*\}/,
  replacementCode.trim()
);

fs.writeFileSync('server.ts', code);
