const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const newSaveMethods = `
  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitle.trim() && !newResContent.trim()) return;

    setIsDecluttering(true);
    let finalTitle = newResTitle;
    let finalContent = newResContent;

    if (!finalTitle.trim() && settings.apiKey) {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        headers['x-api-key'] = settings.apiKey;
        if (settings.apiModel) headers['x-api-model'] = settings.apiModel;

        const res = await fetch('/api/generate-title', {
          method: 'POST',
          headers,
          body: JSON.stringify({ content: newResContent })
        });
        const data = await res.json();
        if (res.ok && data.title) {
          finalTitle = data.title;
        }
      } catch (err) {
        console.error('Error generating title:', err);
      }
    }
    
    setIsDecluttering(false);

    if (editingResource === 'new') {
      onAddResource(finalTitle || 'Untitled Resource', finalContent);
    } else if (editingResource) {
      onUpdateResource(editingResource.id, finalTitle || 'Untitled Resource', finalContent);
    }
    { setNavDirection('backward'); setEditingResource(null); };
  };

  const handleSaveAndCleanup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitle.trim() && !newResContent.trim()) return;

    setIsDecluttering(true);
    let finalTitle = newResTitle;
    let finalContent = newResContent;

    try {
      if (settings.apiKey) {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        headers['x-api-key'] = settings.apiKey;
        if (settings.apiModel) headers['x-api-model'] = settings.apiModel;
      if (settings.prompts) headers['x-custom-prompts'] = JSON.stringify(settings.prompts);
      if (settings.simpleOcrKey) headers['x-simple-ocr-key'] = settings.simpleOcrKey;
      if (settings.formattedOcrKey) headers['x-formatted-ocr-key'] = settings.formattedOcrKey;
      headers['x-ocr-type'] = ocrType;

        const res = await fetch('/api/declutter-resource', {
          method: 'POST',
          headers,
          body: JSON.stringify({ title: newResTitle, content: newResContent })
        });
        
        const data = await res.json();
        if (res.ok && !data.error) {
          if (data.title) finalTitle = data.title;
          if (data.content) finalContent = data.content;
        } else {
          console.error("Declutter AI error", data.error);
        }
      }
    } catch (err: any) {
      console.error('Error in declutter:', err);
    } finally {
      setIsDecluttering(false);
    }

    if (editingResource === 'new') {
      onAddResource(finalTitle || 'Untitled Resource', finalContent);
    } else if (editingResource) {
      onUpdateResource(editingResource.id, finalTitle || 'Untitled Resource', finalContent);
    }
    { setNavDirection('backward'); setEditingResource(null); };
  };
`;

code = code.replace(
  /const handleSaveResource = async \(e: React\.FormEvent\) => \{[\s\S]*?\{ setNavDirection\('backward'\); setEditingResource\(null\); \};\n\s*\};/,
  newSaveMethods
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
