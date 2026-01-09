import React, { useState } from 'react';

/**
 * EditableImage
 * Wraps a standard img tag. In Development, it allows dragging a new image onto it.
 * 
 * Props:
 * - srcBound: (Optional) If provided, overrides src directly from CMS logic.
 * - cmsBind: { file: "Hero", key: "afbeelding", index: 0 }
 */
export default function EditableImage({ src, alt, className, cmsBind, ...props }) {
  const isDev = import.meta.env.DEV;
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Als we niet in dev mode zijn, render gewoon de image
  if (!isDev) {
    return <img src={src} alt={alt} className={className} {...props} />;
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsHovering(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsHovering(false);
    
    if (!cmsBind) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) return;

      setIsUploading(true);
      
      try {
        // 1. Upload File
        await fetch('/__athena/upload', {
          method: 'POST',
          headers: {
            'X-Filename': file.name
          },
          body: file
        });

        // 2. Update JSON
        await fetch('/__athena/update-json', {
            method: 'POST',
            body: JSON.stringify({
                file: cmsBind.file,
                index: cmsBind.index || 0,
                key: cmsBind.key,
                value: file.name
            })
        });

        // 3. Reload Page to show changes
        window.location.reload();

      } catch (err) {
        console.error("Edit error:", err);
        alert("Fout bij updaten: " + err.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div 
      className={`relative group ${className}`} 
      onDragOver={handleDragOver} 
      onDragLeave={handleDragLeave} 
      onDrop={handleDrop}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" {...props} />
      
      {/* Overlay UI for Dev Mode */}
      <div className={`absolute inset-0 bg-blue-500/50 flex items-center justify-center transition-opacity pointer-events-none ${isHovering ? 'opacity-100' : 'opacity-0 group-hover:opacity-10'}`}>
        <span className="text-white font-bold bg-black/50 px-3 py-1 rounded">
          {isUploading ? "Uploading..." : "Sleep afbeelding hier"}
        </span>
      </div>
      
      {/* Debug Info */}
      <div className="absolute top-0 right-0 bg-yellow-300 text-xs px-1 opacity-0 group-hover:opacity-100 pointer-events-none">
        Wait: {cmsBind.file}.{cmsBind.key}
      </div>
    </div>
  );
}
