import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function recreateBandoImages() {
  const inputImage = join(__dirname, '..', 'attached_assets', 'image_1760929343850.png');
  const outputDir = join(__dirname, '..', 'attached_assets', 'bando_options');
  
  const metadata = await sharp(inputImage).metadata();
  const imageWidth = metadata.width;
  const imageHeight = metadata.height;
  
  const buttonWidth = Math.floor(imageWidth / 4);
  const buttonHeight = imageHeight;
  
  const buttons = [
    { name: 'sem-laterais', left: 0, changeColor: false },
    { name: 'lateral-esquerda', left: buttonWidth, changeColor: true },
    { name: 'lateral-direita', left: buttonWidth * 2, changeColor: true },
    { name: 'duas-laterais', left: buttonWidth * 3, changeColor: false }
  ];
  
  for (const button of buttons) {
    let imageBuffer = await sharp(inputImage)
      .extract({
        left: button.left,
        top: 0,
        width: buttonWidth,
        height: buttonHeight
      })
      .toBuffer();
    
    if (button.changeColor) {
      // Aplicar transformação de cor: azul -> preto
      // Usar composição de canal para trocar cores
      const { data, info } = await sharp(imageBuffer)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      
      const pixels = Buffer.from(data);
      
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        
        // Detectar azul (onde azul é dominante)
        if (b > 120 && b > r + 30 && b > g + 30) {
          // Trocar para preto mantendo a luminosidade relativa
          const luminosity = Math.min(r, g, b);
          pixels[i] = luminosity;     // R
          pixels[i + 1] = luminosity; // G
          pixels[i + 2] = luminosity; // B
        }
      }
      
      imageBuffer = await sharp(pixels, {
        raw: {
          width: info.width,
          height: info.height,
          channels: 4
        }
      })
      .png()
      .toBuffer();
    }
    
    await sharp(imageBuffer).toFile(join(outputDir, `${button.name}.png`));
    console.log(`Created: ${button.name}.png ${button.changeColor ? '(color changed)' : ''}`);
  }
  
  console.log('All images recreated successfully!');
}

recreateBandoImages().catch(console.error);
