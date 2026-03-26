import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (!dirFile.includes('node_modules')) {
        filelist = walkSync(dirFile, filelist);
      }
    } else if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const srcDir = path.join(__dirname, 'src');
const files = walkSync(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Revert the bad asChild replacements
  content = content.replace(/asChild=\{true\}\s+as\s+any/g, 'asChild');
  
  // ALso revert asChild={true} as={true} any={true} if it was altered by formatting
  content = content.replace(/asChild=\{true\}\s+as=\{true\}\s+any=\{true\}/g, 'asChild');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Reverted in ${file}`);
  }
});
console.log('Done reverting asChild.');
