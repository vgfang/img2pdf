import { PDFDocument } from 'pdf-lib';
import { type PageFormat } from '@/lib/page-formats';

const DPI = 300;

const getTargetPixelSize = (
  boxDim: { width: number; height: number },
  imageDim: { width: number; height: number }
) => {
  const widthRatio = boxDim.width / imageDim.width;
  const heightRatio = boxDim.height / imageDim.height;

  const scaleFactor = Math.min(1, widthRatio, heightRatio);

  return {
    targetWidthPx: Math.round(imageDim.width * scaleFactor),
    targetHeightPx: Math.round(imageDim.height * scaleFactor),
  };
};

const compressImage = async (
  image: File,
  quality: number,
  targetWidthPx: number,
  targetHeightPx: number,
  greyscale: boolean
): Promise<ArrayBuffer> => {
  const bitmap = await createImageBitmap(image);
  const canvas = document.createElement('canvas');
  canvas.width = targetWidthPx;
  canvas.height = targetHeightPx;
  const ctx = canvas.getContext('2d', { colorSpace: 'srgb' });
  if (!ctx) {
    alert('Failed to get context');
    throw new Error('Failed to get canvas context');
  }

  if (greyscale) {
    ctx.filter = 'grayscale(100%)';
  }

  ctx.drawImage(bitmap, 0, 0, targetWidthPx, targetHeightPx);
  const qual = quality / 100;

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to compress image'));
        }
      },
      'image/jpeg',
      qual
    );
  });

  return blob.arrayBuffer();
};

const ptsToPx = (pts: number) => {
  return Math.round((pts / 72) * DPI);
};

const pxToPts = (px: number) => {
  return Math.round((px * 72) / DPI);
};

const convertImagesToPdf = async (
  images: File[],
  quality: number,
  pg: PageFormat,
  portrait: boolean,
  greyscale: boolean,
  margin: string,
  scaleUp: boolean,
  setProgress: (value: number) => void
): Promise<Blob> => {
  const pdfDoc = await PDFDocument.create();

  // get page and content dimensions
  const marginIn = Number(margin);
  const marginPts = marginIn * 72;

  let pageWidthPts = pg.widthIn * 72;
  let pageHeightPts = pg.heightIn * 72;

  if (portrait) {
    [pageWidthPts, pageHeightPts] = [pageHeightPts, pageWidthPts];
  }
  const contentWidthPts = pageWidthPts - marginPts * 2;
  const contentHeightPts = pageHeightPts - marginPts * 2;
  const contentWidthPx = ptsToPx(contentWidthPts);
  const contentHeightPx = ptsToPx(contentHeightPts);

  for (const [i, image] of images.entries()) {
    // analyze original image
    const bitmap = await createImageBitmap(image);
    const imgDim = { width: bitmap.width, height: bitmap.height };

    // scaling image up / compressing to fit DPI in case it's bigger
    const { targetWidthPx, targetHeightPx } = getTargetPixelSize(
      { width: contentWidthPx, height: contentHeightPx },
      imgDim
    );

    // jpeg compression
    const compressedImgBytes = await compressImage(
      image,
      quality,
      targetWidthPx,
      targetHeightPx,
      greyscale
    );

    // put image in pdf page
    const pdfImg = await pdfDoc.embedJpg(compressedImgBytes);
    const page = pdfDoc.addPage([pageWidthPts, pageHeightPts]);

    // convert image px to pts
    const imgWidthPts = pxToPts(targetWidthPx);
    const imgHeightPts = pxToPts(targetHeightPx);

    // decide if we should scale up to fill box
    let drawWidth = imgWidthPts;
    let drawHeight = imgHeightPts;

    if (scaleUp) {
      const wRatio = contentWidthPts / imgWidthPts;
      const hRatio = contentHeightPts / imgHeightPts;
      const scale = Math.min(wRatio, hRatio);

      if (scale > 1) {
        drawWidth *= scale;
        drawHeight *= scale;
      }
    }

    const drawX = marginPts + (contentWidthPts - drawWidth) / 2;
    const drawY = marginPts + (contentHeightPts - drawHeight);

    page.drawImage(pdfImg, {
      x: drawX,
      y: drawY,
      width: drawWidth,
      height: drawHeight,
    });
    setProgress(Math.round(((i + 1) / images.length) * 100));
  }

  const pdfBytes = await pdfDoc.save();

  return new Blob([pdfBytes] as BlobPart[], { type: 'application/pdf' });
};

export default convertImagesToPdf;
