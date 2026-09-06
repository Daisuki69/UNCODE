const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const stateBlock = `
  const [completedHomeworks, setCompletedHomeworks] = useState<import('./types').CompletedHomework[]>(() => {
    const saved = localStorage.getItem('studom_completed_homeworks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('studom_completed_homeworks', JSON.stringify(completedHomeworks));
  }, [completedHomeworks]);
`;

app = app.replace(/const \[logs, setLogs\] = useState<LogEntry\[\]>\(\(\) => \{[\s\S]*?\}, \[logs\]\);/, match => match + stateBlock);

fs.writeFileSync('src/App.tsx', app);
