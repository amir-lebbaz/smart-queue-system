import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  'src/app/page.tsx',
  'src/app/admin/[slug]/page.tsx',
  'src/app/display/[slug]/page.tsx',
  'src/app/q/[slug]/page.tsx',
  'src/app/super-admin/page.tsx',
];

const replacements = [
  // Hex backgrounds
  { from: /bg-\[#08131F\]/g, to: 'bg-slateNavy-950' },
  { from: /bg-\[#16314A\]/g, to: 'bg-slateNavy-900' },
  { from: /bg-\[#2E4F6B\]/g, to: 'bg-slateNavy-800' },
  { from: /bg-\[#3D6282\]/g, to: 'bg-slateNavy-700' },
  { from: /bg-\[#5F7F98\]/g, to: 'bg-slateNavy-600' },
  { from: /bg-\[#A9BDC9\]/g, to: 'bg-slateNavy-400' },
  { from: /bg-\[#E8EFF3\]/g, to: 'bg-slateNavy-100' },

  // Hex texts
  { from: /text-\[#08131F\]/g, to: 'text-slateNavy-950' },
  { from: /text-\[#16314A\]/g, to: 'text-slateNavy-900' },
  { from: /text-\[#2E4F6B\]/g, to: 'text-slateNavy-800' },
  { from: /text-\[#5F7F98\]/g, to: 'text-slateNavy-600' },
  { from: /text-\[#A9BDC9\]/g, to: 'text-slateNavy-400' },
  { from: /text-\[#E8EFF3\]/g, to: 'text-slateNavy-100' },

  // Hex borders
  { from: /border-\[#08131F\]/g, to: 'border-slateNavy-950' },
  { from: /border-\[#16314A\]/g, to: 'border-slateNavy-900' },
  { from: /border-\[#2E4F6B\]/g, to: 'border-slateNavy-800' },
  { from: /border-\[#5F7F98\]/g, to: 'border-slateNavy-600' },
  { from: /border-\[#A9BDC9\]/g, to: 'border-slateNavy-400' },
  { from: /border-\[#E8EFF3\]/g, to: 'border-slateNavy-100' },

  // Selections
  { from: /selection:bg-\[#2E4F6B\]/g, to: 'selection:bg-slateNavy-800' },
  { from: /selection:text-\[#E8EFF3\]/g, to: 'selection:text-slateNavy-100' },

  // Gradients
  { from: /from-\[#08131F\]/g, to: 'from-slateNavy-950' },
  { from: /via-\[#16314A\]/g, to: 'via-slateNavy-900' },
  { from: /to-\[#08131F\]/g, to: 'to-slateNavy-950' },
  { from: /from-\[#2E4F6B\]/g, to: 'from-slateNavy-800' },
  { from: /via-\[#2E4F6B\]/g, to: 'via-slateNavy-800' },
  { from: /to-\[#16314A\]/g, to: 'to-slateNavy-900' },
  { from: /from-\[#E8EFF3\]/g, to: 'from-slateNavy-100' },
  { from: /via-\[#A9BDC9\]/g, to: 'via-slateNavy-400' },
];

let totalChanges = 0;

for (const relPath of filesToUpdate) {
  const fullPath = path.resolve(process.cwd(), relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping missing: ${relPath}`);
    continue;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  let fileChanges = 0;

  for (const { from, to } of replacements) {
    const matches = content.match(from);
    if (matches) {
      fileChanges += matches.length;
      content = content.replace(from, to);
    }
  }

  if (fileChanges > 0) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated ${relPath}: ${fileChanges} replacements made.`);
    totalChanges += fileChanges;
  } else {
    console.log(`No hex replacements needed in ${relPath}.`);
  }
}

console.log(`Done! Total replacements across all pages: ${totalChanges}`);
