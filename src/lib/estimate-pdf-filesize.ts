const estimatePdfFileSize = async (
  images: File[],
  widthIn: number,
  heightIn: number,
  quality: number
): Promise<string> => {
  if (images.length === 0) return '0 B';

  // precompute first image to get real JPEG size
  const firstImage = images[0];
  const bitmap = await createImageBitmap(firstImage);

  const pageWidthPts = widthIn * 72;
  const pageHeightPts = heightIn * 72;
  const contentWidthPx = Math.round((pageWidthPts / 72) * 300);
  const contentHeightPx = Math.round((pageHeightPts / 72) * 300);

  // actually compress first image to get real size
  const canvas = document.createElement('canvas');
  canvas.width = contentWidthPx;
  canvas.height = contentHeightPx;
  const ctx = canvas.getContext('2d', { colorSpace: 'srgb' });
  ctx?.drawImage(bitmap, 0, 0);

  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', quality / 100);
  });

  const realJpegSize = blob.size;

  // Scale for all images
  const bytes = 3000 + images.length * (realJpegSize + 1500);

  let display = bytes;
  let unit = 'B';

  if (display > 1024) {
    display /= 1024;
    unit = 'KB';
  }
  if (display > 1024) {
    display /= 1024;
    unit = 'MB';
  }

  return `${display.toFixed(2)} ${unit}`;
};

export default estimatePdfFileSize;
