import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function cropBandoImages() {
  const inputImage = join(__dirname, '..', 'attached_assets', 'image_1760929343850.png');
  const outputDir = join(__dirname, '..', 'attached_assets', 'bando_options');
  
  const metadata = await sharp(inputImage).metadata();
  const imageWidth = metadata.width;
  const imageHeight = metadata.height;
  
  const buttonWidth = Math.floor(imageWidth / 4);
  const buttonHeight = imageHeight;
  
  const buttons = [
    { name: 'sem-laterais', left: 0 },
    { name: 'lateral-esquerda', left: buttonWidth },
    { name: 'lateral-direita', left: buttonWidth * 2 },
    { name: 'duas-laterais', left: buttonWidth * 3 }
  ];
  
  for (const button of buttons) {
    await sharp(inputImage)
      .extract({
        left: button.left,
        top: 0,
        width: buttonWidth,
        height: buttonHeight
      })
      .toFile(join(outputDir, `${button.name}.png`));
    
    console.log(`Created: ${button.name}.png`);
  }
  
  console.log('All images created successfully!');
}

cropBandoImages().catch(console.error);
