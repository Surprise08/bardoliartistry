import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, Image } from 'lucide-react';

interface FileUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  accept?: string;
}

const FileUpload = ({ value, onChange, error, accept = "image/*" }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    onChange(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const removeFile = useCallback(() => {
    onChange(null);
    setPreview(null);
  }, [onChange]);

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-border/40 bg-secondary/20">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-cover opacity-90"
          />
          <button
            type="button"
            onClick={removeFile}
            className="absolute top-2 right-2 p-2 rounded-full bg-background/80 text-foreground/80 hover:bg-background hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center",
            "w-full h-48 rounded-lg",
            "border-2 border-dashed transition-all duration-300 cursor-pointer",
            dragActive
              ? "border-accent/50 bg-accent/5"
              : "border-border/40 bg-secondary/20 hover:border-border/60 hover:bg-secondary/30",
            error && "border-destructive/50"
          )}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            {dragActive ? (
              <Image className="w-10 h-10 text-accent" />
            ) : (
              <Upload className="w-10 h-10" />
            )}
            <div className="text-center">
              <p className="text-sm font-body">
                {dragActive ? "Drop your image here" : "Click or drag to upload"}
              </p>
              <p className="text-xs mt-1 text-muted-foreground/60">
                JPG, PNG, or GIF
              </p>
            </div>
          </div>
        </label>
      )}
      {error && (
        <p className="text-sm text-destructive font-body">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
