import fs from 'fs';
import path from 'path';

const resourcesDir = path.join(process.cwd(), 'src/resources');

export interface HtmlFile {
  title: string;
  slug: string[];
  path: string;
}

function traverseDir(dir: string, baseDir: string = dir, fileList: HtmlFile[] = []): HtmlFile[] {
  if (!fs.existsSync(dir)) return fileList;
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      traverseDir(fullPath, baseDir, fileList);
    } else if (file.endsWith('.html')) {
      const relativePath = path.relative(baseDir, fullPath);
      // Remove .html for the slug, split by path separator
      const slug = relativePath.replace(/\.html$/, '').split(path.sep);
      const title = file.replace(/\.html$/, '').replace(/-/g, ' ');
      
      fileList.push({
        title,
        slug,
        path: relativePath,
      });
    }
  }
  
  return fileList;
}

export function getHtmlFiles(): HtmlFile[] {
  return traverseDir(resourcesDir);
}

export function getHtmlContent(slug: string[]): string | null {
  const filePath = path.join(resourcesDir, `${slug.join(path.sep)}.html`);
  
  // Basic security check to prevent directory traversal
  if (!filePath.startsWith(resourcesDir)) {
    return null;
  }

  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  
  return null;
}
