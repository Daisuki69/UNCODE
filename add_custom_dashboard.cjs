const fs = require('fs');
let dashboard = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

dashboard = dashboard.replace(/<motion\.div\n\s*key="edit-resource"\n\s*variants=\{pageVariants\}/, '<motion.div\n            key="edit-resource"\n            custom={navDirection}\n            variants={pageVariants}');
dashboard = dashboard.replace(/<motion\.div\n\s*key="main-dashboard"\n\s*variants=\{pageVariants\}/, '<motion.div\n            key="main-dashboard"\n            custom={navDirection}\n            variants={pageVariants}');

fs.writeFileSync('src/components/Dashboard.tsx', dashboard);
