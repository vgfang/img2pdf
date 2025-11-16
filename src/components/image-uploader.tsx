import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

interface ImageUploaderProps {
  onImagesChange?: (images: UploadedImage[]) => void;
}

function truncateFilename(name: string, maxLength: number = 20): string {
  if (name.length <= maxLength) return name;
  const dotIndex = name.lastIndexOf('.');
  const ext = dotIndex > -1 ? name.slice(dotIndex) : '';
  const nameWithoutExt = dotIndex > -1 ? name.slice(0, dotIndex) : name;
  const availableLength = maxLength - ext.length - 3; // 3 for "..."
  const start = Math.ceil(availableLength / 2);
  const end = availableLength - start;
  return (
    nameWithoutExt.slice(0, start) + '...' + nameWithoutExt.slice(-end) + ext
  );
}

export function ImageUploader({ onImagesChange }: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    );
    const filesToAdd = fileArray.slice(0);

    const newImages = filesToAdd.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
  };

  const removeImage = (id: string) => {
    const updatedImages = images.filter((img) => img.id !== id);
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // Handle drag and drop reordering
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverItem = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropItem = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = images.findIndex((img) => img.id === draggedItem);
    const targetIndex = images.findIndex((img) => img.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null);
      return;
    }

    const newImages = [...images];
    [newImages[draggedIndex], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[draggedIndex],
    ];

    setImages(newImages);
    onImagesChange?.(newImages);
    setDraggedItem(null);
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 bg-background hover:bg-muted/50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">Drag and drop images here</p>
            <p className="text-muted-foreground">
              or{' '}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="accent hover:underline cursor-pointer"
              >
                click to browse
              </button>
            </p>
          </div>
          <p>
            {images.length} {images.length === 1 ? 'image' : 'images'}
          </p>
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {images.map((image) => (
            <div
              key={image.id}
              draggable
              onDragStart={(e) => handleDragStart(e, image.id)}
              onDragOver={handleDragOverItem}
              onDrop={(e) => handleDropItem(e, image.id)}
              className={cn(
                'group relative aspect-square cursor-move rounded-lg border transition-all',
                draggedItem === image.id
                  ? 'border-primary bg-primary/10 opacity-50'
                  : 'border-border hover:border-primary/50 hover:shadow-md'
              )}
            >
              <img
                src={image.preview || '/placeholder.svg'}
                alt="upload preview"
                className="h-full w-full rounded-lg object-cover"
              />

              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-all group-hover:bg-black/40 pointer-events-none">
                <GripVertical className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              <button
                onClick={() => removeImage(image.id)}
                className="absolute -right-2 -top-2 rounded-full background-accent p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
              >
                <X className="h-[18px] w-[18px]" />
              </button>

              <div className="absolute bottom-1 left-1 right-1 flex items-center gap-1.5 rounded bg-background/95 px-2 py-1 border border-border">
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-foreground text-background text-xs font-medium">
                  {images.indexOf(image) + 1}
                </div>
                <span
                  className="truncate text-xs font-medium text-foreground min-w-0 flex-1"
                  title={image.file.name}
                >
                  {truncateFilename(image.file.name)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setImages([]);
              onImagesChange?.([]);
            }}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
