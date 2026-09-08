const fs = require('fs');
let serverCode = fs.readFileSync('server.ts', 'utf8');

// First, update server.ts to support 'raw' docType which just returns the raw extracted text.
// Looking at server.ts line 111, there is already 'transcription' type which seems to do EXACTLY this.
// Let's verify that Dashboard is sending 'homework' instead of 'transcription' for resources.

let dashboardCode = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
// Dashboard line 153: formData.append('type', 'homework');
// But this is in the resource adding section? Wait, handleFileUpload in Dashboard is for adding a RESOURCE.
// Why is it sending 'homework'? If it's a resource, it should be parsed as a resource (flashcards) or raw.
// The issue is that the user wants the uploaded image text to be placed in the textarea RAW, 
// so the user can edit it, and then clicking Save & Cleanup will actually run the flashcard AI prompt.

// So, we should change formData.append('type', 'homework'); to 'transcription' (which returns raw text).
dashboardCode = dashboardCode.replace(
  "formData.append('type', 'homework'); // Skip AI parsing for raw OCR",
  "formData.append('type', 'transcription'); // Dump raw OCR text for manual review before cleanup"
);

fs.writeFileSync('src/components/Dashboard.tsx', dashboardCode);
