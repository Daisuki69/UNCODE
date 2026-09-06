const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const oldStylePattern1 = /Act as a practical college student who just wants to pass\.[^.]*\./gi;
const oldStylePattern2 = /CRITICAL: Act as a practical college student who just wants to pass\.[^\n]*/gi;
const oldStylePattern3 = /You're a practical college student who just wants to pass[^.]*\.[^.]*\./gi;

const newStyle = `Write with a purely functional, diagnostic efficiency. Eliminate all conversational fluff, academic jargon, and narrative detours. Use structurally precise, logically sequential, and direct language. Deliver raw cause-and-effect information in the shortest path possible using plain-spoken, unambiguous terms.`;

content = content.replace(oldStylePattern1, newStyle);
content = content.replace(oldStylePattern2, `CRITICAL: ${newStyle}`);
content = content.replace(oldStylePattern3, newStyle);

fs.writeFileSync('server.ts', content);
