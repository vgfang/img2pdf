import './App.css';
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ImageUploader, type UploadedImage } from '@/components/image-uploader';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import convertImagesToPdf from '@/lib/convert-img-to-pdf';
import { PAGE_FORMATS } from '@/lib/page-formats';
import { MARGIN_OPTIONS } from '@/lib/margin-options';

function App() {
  const DEFAULT_FORMAT = 'a4';

  const [images, setImages] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState(90);
  const [fileSize, setFileSize] = useState(70);
  const [format, setFormat] = useState(DEFAULT_FORMAT);
  const [portrait, setPortrait] = useState(false);
  const [greyscale, setGreyscale] = useState(false);
  const [margin, setMargin] = useState('0');

  const estimateFileSize = () => {
    let estimate = 0;
    for (const image in images) {
      // TODO
    }
    setFileSize(estimate);
  };

  const setUploadedImages = (uploadedImages: UploadedImage[]) => {
    setImages(uploadedImages.map((img) => img.file));
  };

  const handleConvertImagesToPdf = () => {
    console.log(images);
    convertImagesToPdf(images, quality, setProgress).then((blob) => {
      const url = URL.createObjectURL(blob);
      const date = new Date();
      const a = document.createElement('a');
      a.href = url;
      console.log(url);
      a.download = `img2pdf-${date.toLocaleString()}.pdf`;
      a.click();
      setTimeout(() => {
        setProgress(0);
      }, 1000);
    });
  };

  return (
    <div className="flex flex-col w-[85%] max-w-[1000px] m-auto gap-8 my-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-left">img2pdf</h1>
        <p className="text-left">
          Convert images to PDF files with an image on each page.
        </p>
        <p className="text-left">
          Made by{' '}
          <a href="https://github.com/vgfang" className="cursor-pointer">
            me.
          </a>
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-left">1. Upload and order images</h2>
        <ImageUploader onImagesChange={setUploadedImages} />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-left">2. Apply settings</h2>
        <div className="flex flex-row gap-2 items-center flex-wrap">
          <Label
            className="whitespace-nowrap min-w-22 tabular-nums"
            htmlFor="quality"
          >
            Quality: {quality}%
          </Label>
          <Slider
            id="quality"
            defaultValue={[quality]}
            min={1}
            max={100}
            step={1}
            className="max-w-[40%] min-w-[100px] py-4"
            onValueChange={(value) => setQuality(value[0])}
          />
          <Separator />
          <div className="flex flex-row items-center gap-2 py-2">
            <Label htmlFor="greyscale">Greyscale:</Label>
            <Checkbox
              id="greyscale"
              checked={greyscale}
              onCheckedChange={(value) =>
                setGreyscale(typeof value == 'boolean' ? value : false)
              }
            />
          </div>
          <Separator />
          <div className="flex flex-row items-center gap-2">
            <Label htmlFor="pageformat">Format:</Label>
            <Select value={format} onValueChange={(value) => setFormat(value)}>
              <SelectTrigger className="w-[120px]" id="pageformat">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select Format:</SelectLabel>
                  {PAGE_FORMATS.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Label htmlFor="portrait">Portrait</Label>
            <Checkbox
              id="portrait"
              checked={portrait}
              onCheckedChange={(value) =>
                setPortrait(typeof value == 'boolean' ? value : false)
              }
            />
          </div>
          <Separator />
          <div className="flex flex-row items-center gap-2">
            <Label htmlFor="pageformat">Margin:</Label>
            <Select value={margin} onValueChange={(value) => setMargin(value)}>
              <SelectTrigger className="w-[120px]" id="pageformat">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Set Inches:</SelectLabel>
                  {MARGIN_OPTIONS.map((margin) => (
                    <SelectItem key={margin.value} value={margin.value}>
                      {margin.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-left">3. Save PDF</h2>
        <div className="flex flex-row gap-2 items-center">
          <Button
            className="background-accent"
            onClick={handleConvertImagesToPdf}
            disabled={images.length < 1}
          >
            Download as PDF
          </Button>
          <Progress value={progress} />
          <p className="whitespace-nowrap tabular-nums">
            ~{fileSize.toFixed(2)} MB
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
