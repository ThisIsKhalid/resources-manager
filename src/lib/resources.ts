import fs from 'fs';
import path from 'path';

const resourcesDir = path.join(process.cwd(), 'src/resources');

export interface HtmlFile {
  title: string;
  description?: string;
  category: string;
  slug: string[];
  path: string;
}

// Helper to extract JSON from HTML comments like
// <!-- { "title": "Custom Title", "description": "Custom Description" } -->
function extractMetadata(filePath: string): { title?: string; description?: string } {
  try {
    // Only read the first 1000 bytes to keep parsing fast
    const buffer = Buffer.alloc(1000);
    const fd = fs.openSync(filePath, 'r');
    const bytesRead = fs.readSync(fd, buffer, 0, 1000, 0);
    fs.closeSync(fd);
    
    const content = buffer.toString('utf-8', 0, bytesRead);
    const match = content.match(/<!--\s*(\{[\s\S]*?\})\s*-->/);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    }
  } catch (e) {
    // Ignore read or parse errors and return empty metadata
  }
  return {};
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
      const slugParts = relativePath.replace(/\.html$/, '').split(path.sep);
      
      // The category is the parent folder or "Uncategorized" if in the root
      const category = slugParts.length > 1 
        ? slugParts[0].replace(/-/g, ' ') 
        : 'Uncategorized';
        
      const rawTitle = file.replace(/\.html$/, '').replace(/-/g, ' ');
      
      const metadata = extractMetadata(fullPath);
      
      fileList.push({
        title: metadata.title || rawTitle,
        description: metadata.description,
        category,
        slug: slugParts,
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
