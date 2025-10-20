import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function changeBandoColor() {
  const inputImage = join(__dirname, '..', 'attached_assets', 'bando_options', 'lateral-esquerda.png');
  const outputImage = join(__dirname, '..', 'attached_assets', 'bando_options', 'lateral-esquerda.png');
  
  // Ler a imagem
  const image = sharp(inputImage);
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  // Processar pixels para trocar azul por preto
  const pixels = new Uint8ClampedArray(data);
  
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    
    // Detectar tons de azul (b > r e b > g)
    // Se for azul, trocar para preto
    if (b > r && b > g && b > 100) {
      pixels[i] = 0;     // R = 0
      pixels[i + 1] = 0; // G = 0
      pixels[i + 2] = 0; // B = 0
      // Manter alpha
    }
  }
  
  // Salvar a imagem modificada
  await sharp(pixels, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
  .png()
  .toFile(outputImage);
  
  console.log('Cor alterada de azul para preto com sucesso!');
}

changeBandoColor().catch(console.error);
