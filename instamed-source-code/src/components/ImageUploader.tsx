import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
    onImageSelect: (base64: string | null) => void;
}

export function ImageUploader({ onImageSelect }: ImageUploaderProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setPreview(base64);
                onImageSelect(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setPreview(null);
        onImageSelect(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-4">
            {!preview ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                >
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-foreground">Upload an image of the symptoms</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
            ) : (
                <div className="relative rounded-xl overflow-hidden border border-border bg-muted/30 p-2">
                    <img
                        src={preview}
                        alt="Symptom preview"
                        className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-4 right-4 h-8 w-8 rounded-full shadow-lg"
                        onClick={clearImage}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-2 mt-2 px-1 py-1">
                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground truncate flex-1">Image selected for analysis</span>
                    </div>
                </div>
            )}
        </div>
    );
}
