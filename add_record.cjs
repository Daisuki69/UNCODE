const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const recordBlock = `
      setEvaluationResult(data);
      setCompletedHomeworks(prev => [{
        id: crypto.randomUUID(),
        title: activeSchedule?.title || 'Untitled Schedule',
        homeworkContent: activeSchedule?.homeworkContent || '',
        rubricContent: activeSchedule?.rubricContent || '',
        transcribedText: data.transcribedText || '',
        feedback: data.feedback || '',
        passed: data.passed || false,
        timestamp: Date.now()
      }, ...prev]);
`;

app = app.replace(/setEvaluationResult\(data\);/, recordBlock);

fs.writeFileSync('src/App.tsx', app);
