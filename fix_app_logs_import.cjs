const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  /import \{ LogsPage \} from '\.\/components\/LogsPage';/,
  `import { HomeworksPage } from './components/HomeworksPage';`
);

app = app.replace(
  /<LogsPage\s*logs=\{logs\}\s*onBack=\{\(\) => navigate\('dashboard', 'backward'\)\}\s*onClear=\{\(\) => setLogs\(\[\]\)\}\s*\/>/,
  `<HomeworksPage 
              homeworks={completedHomeworks}
              onBack={() => navigate('dashboard', 'backward')}
              onClear={() => setCompletedHomeworks([])}
            />`
);

fs.writeFileSync('src/App.tsx', app);
