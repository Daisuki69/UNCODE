const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');
let dashboard = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const headerRegex = /\{\['dashboard', 'settings', 'logs'\].includes\(appState\) && !isResourceEditing && \([\s\S]*?<\/header>\s*\)\}/;
const headerMatch = app.match(headerRegex);

if (headerMatch) {
  app = app.replace(headerRegex, '');
  
  // Add props to Dashboard in App.tsx
  app = app.replace(
    /<Dashboard showError=\{setGlobalError\}/,
    `<Dashboard showError={setGlobalError}
              displayTime={displayTime}
              timeOffset={timeOffset}
              onTimeOverride={handleTimeOverride}
              onResetTime={() => setTimeOffset(0)}`
  );

  fs.writeFileSync('src/App.tsx', app);

  // Update DashboardProps
  dashboard = dashboard.replace(
    /onResourceEditStateChange\?: \(isEditing: boolean\) => void;\n}/,
    `onResourceEditStateChange?: (isEditing: boolean) => void;
  displayTime: Date;
  timeOffset: number;
  onTimeOverride: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetTime: () => void;
}`
  );

  // Update Dashboard component signature
  dashboard = dashboard.replace(
    /onViewRubric,\n\s*onOpenLogs,\n\s*onResourceEditStateChange\n\}: DashboardProps\)/,
    `onViewRubric,
  onOpenLogs,
  onResourceEditStateChange,
  displayTime,
  timeOffset,
  onTimeOverride,
  onResetTime
}: DashboardProps)`
  );

  // Format the time for input
  const formatCode = `
  const formatForInput = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return \`\${pad(d.getHours())}:\${pad(d.getMinutes())}:\${pad(d.getSeconds())}\`;
  };
`;
  
  dashboard = dashboard.replace(
    /const fileInputRef = useRef<HTMLInputElement>\(null\);/,
    `const fileInputRef = useRef<HTMLInputElement>(null);
  ${formatCode}`
  );

  // Insert the header inside the main-dashboard motion.div
  const headerContent = headerMatch[0]
    .replace(/\{\['dashboard', 'settings', 'logs'\].includes\(appState\) && !isResourceEditing && \(/, '')
    .replace(/\)\}/, '')
    .trim();

  // We want to put it right inside the `<motion.div key="main-dashboard"`
  dashboard = dashboard.replace(
    /<motion\.div\n\s*key="main-dashboard"[\s\S]*?className="max-w-5xl mx-auto w-full p-6 absolute inset-0 overflow-y-auto"\n\s*>/,
    `$&
        ${headerContent}
`
  );
  // wait, navigate('dashboard', 'backward') inside headerContent will cause an error because `navigate` isn't defined in Dashboard.
  // We can just remove the onClick from the h1.
  
  fs.writeFileSync('src/components/Dashboard.tsx', dashboard);
  console.log("Updated!");
} else {
  console.log("Could not find header in App.tsx");
}
