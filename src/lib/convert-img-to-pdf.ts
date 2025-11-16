import { PDFDocument } from 'pdf-lib';

const fitImageToPage = (
  imgWidth: number,
  imgHeight: number,
  pageWidth: number,
  pageHeight: number
) => {
  const imgRatio = imgWidth / imgHeight;
  const pageRatio = pageWidth / pageHeight;

  let width = pageWidth;
  let height = pageHeight;

  if (imgRatio > pageRatio) {
    height = width / imgRatio;
  } else {
    width = height * imgRatio;
  }

  const x = (pageWidth - width) / 2;
  const y = pageHeight - height; // top anchored

  return { width, height, x, y };
};

const compressImage = async (
  image: File,
  quality: number
): Promise<ArrayBuffer> => {
  const bitmap = await createImageBitmap(image);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d', { colorSpace: 'srgb' });
  if (!ctx) {
    alert('Failed to get context');
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(bitmap, 0, 0);
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

const convertImagesToPdf = async (
  images: File[],
  quality: number,
  setProgress: (value: number) => void
): Promise<Blob> => {
  const pdfDoc = await PDFDocument.create();
  for (const [i, image] of images.entries()) {
    const compressedImgBytes = await compressImage(image, quality);
    const pdfImg = await pdfDoc.embedJpg(compressedImgBytes);

    const page = pdfDoc.addPage();
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();

    const { width, height, x, y } = fitImageToPage(
      pdfImg.width,
      pdfImg.height,
      pageWidth,
      pageHeight
    );

    page.drawImage(pdfImg, {
      x: x,
      y: y,
      width: width,
      height: height,
    });

    setProgress(Math.round(((i + 1) / images.length) * 100));
  }

  const pdfBytes = await pdfDoc.save();

  return new Blob([pdfBytes] as BlobPart[], { type: 'application/pdf' });
};

export default convertImagesToPdf;
