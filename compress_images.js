import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const mediaDir = path.resolve('public/media');

async function processImages() {
  const files = fs.readdirSync(mediaDir);
  
  let totalSaved = 0;
  
  for (const file of files) {
    if (!file.endsWith('.png') && !file.endsWith('.jpg') && !file.endsWith('.jpeg')) continue;
    
    const filePath = path.join(mediaDir, file);
    const stats = fs.statSync(filePath);
    
    // Só comprime imagens maiores que 500KB
    if (stats.size > 500 * 1024) {
      console.log(`Compressing: ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
      const tempPath = path.join(mediaDir, 'temp_' + file);
      
      try {
        await sharp(filePath)
          .resize({ width: 1280, withoutEnlargement: true }) // Reduz para no máximo 1280px de largura
          .png({ quality: 60, compressionLevel: 9 }) // Aplica compressão no PNG
          .toFile(tempPath);
          
        const newStats = fs.statSync(tempPath);
        const saved = stats.size - newStats.size;
        totalSaved += saved;
        
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
        
        console.log(` -> Reduced to ${(newStats.size / 1024 / 1024).toFixed(2)} MB`);
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      }
    }
  }
  
  console.log(`\nDone! Total space saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
}

processImages();
