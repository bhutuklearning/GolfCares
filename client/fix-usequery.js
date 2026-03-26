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

  // Fix useQuery(['key'], fn, {options})
  content = content.replace(/useQuery(?!\<)\s*\(\s*\[(.*?)]\s*,\s*([^,\n\{]+?)\s*,\s*\{(.*?)\}\s*\)/g, 'useQuery({ queryKey: [$1], queryFn: $2, $3 })');
  
  // Fix useQuery(['key'], fn)
  content = content.replace(/useQuery(?!\<)\s*\(\s*\[(.*?)]\s*,\s*([^,\n\{]+?)\s*\)/g, 'useQuery({ queryKey: [$1], queryFn: $2 })');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed useQuery syntax in ${file}`);
  }
});
console.log('Done fixing TS types.');
