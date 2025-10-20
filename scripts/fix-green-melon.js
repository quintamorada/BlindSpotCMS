import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function fixGreenMelon() {
  const outputDir = join(__dirname, '..', 'attached_assets', 'bando_options');
  
  // Verde melão RGB
  const greenMelonR = 177;
  const greenMelonG = 228;
  const greenMelonB = 185;
  
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
      
      // Detectar qualquer tom de azul
      // Azul é quando B é significativamente maior que R e G
      if (a > 0 && b > 50) {
        // Se for azulado (b maior que r e g)
        if (b >= r && b >= g && (b - r > 10 || b - g > 10)) {
          // Calcular intensidade baseada no azul original
          const intensity = b / 255;
          
          pixels[i] = Math.round(greenMelonR * intensity);     // R
          pixels[i + 1] = Math.round(greenMelonG * intensity); // G
          pixels[i + 2] = Math.round(greenMelonB * intensity); // B
          // Manter alpha
        }
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
    
    console.log(`✓ Convertido: ${imageName}.png`);
  }
  
  console.log('\n✓ Todas as abas azuis foram convertidas para verde melão!');
}

fixGreenMelon().catch(console.error);
