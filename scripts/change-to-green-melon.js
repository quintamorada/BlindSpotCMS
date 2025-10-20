import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function changeToGreenMelon() {
  const outputDir = join(__dirname, '..', 'attached_assets', 'bando_options');
  
  // Verde melão RGB: aproximadamente (177, 228, 185) ou (180, 230, 180)
  const greenMelonR = 180;
  const greenMelonG = 230;
  const greenMelonB = 180;
  
  const images = ['lateral-esquerda', 'lateral-direita', 'duas-laterais'];
  
  for (const imageName of images) {
    const imagePath = join(outputDir, `${imageName}.png`);
    
    const { data, info } = await sharp(imagePath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    const pixels = Buffer.from(data);
    
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];
      
      // Detectar azul (onde azul é dominante)
      if (b > 100 && b > r + 20 && b > g + 20) {
        // Trocar para verde melão, mantendo a intensidade relativa
        const intensity = b / 255;
        pixels[i] = Math.round(greenMelonR * intensity);     // R
        pixels[i + 1] = Math.round(greenMelonG * intensity); // G
        pixels[i + 2] = Math.round(greenMelonB * intensity); // B
        // Manter alpha
      }
    }
    
    await sharp(pixels, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .png()
    .toFile(imagePath);
    
    console.log(`Convertido para verde melão: ${imageName}.png`);
  }
  
  console.log('Todas as cores foram alteradas para verde melão!');
}

changeToGreenMelon().catch(console.error);
