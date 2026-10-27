import React, { useRef, useState } from 'react';
import { sound } from '../lib/sound';

interface UploadCardProps {
  title: string;
  subtitle: string;
  imagePreviewUrl: string | null;
  buttonLabel: string;
  changeLabel?: string;
  dragDropHint?: string;
  formatHint?: string;
  onSelectFile: (file: File) => void;
  onClear: () => void;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  title,
  subtitle,
  imagePreviewUrl,
  buttonLabel,
  changeLabel = 'Change Photo',
  dragDropHint = 'Click or drag image here',
  formatHint = 'JPG, PNG, WEBP • Max 10MB',
  onSelectFile,
  onClear,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      sound.playClick();
      onSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      sound.playClick();
      onSelectFile(e.target.files[0]);
    }
  };

  const triggerUpload = () => {
    sound.playClick();
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-card">
      <div className="upload-card__label">{title}</div>
      <div className="upload-card__desc">{subtitle}</div>

      <div
        className={`upload-card__dropzone ${isDragging ? 'upload-card__dropzone--active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!imagePreviewUrl ? triggerUpload : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />

        {imagePreviewUrl ? (
          <div className="upload-card__preview">
            <button
              className="upload-card__remove"
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onClear();
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              title="Remove image"
            >
              ✕
            </button>
            <img src={imagePreviewUrl} alt={title} />
          </div>
        ) : (
          <div className="upload-card__placeholder">
            <div className="upload-card__placeholder-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className="upload-card__placeholder-text">{dragDropHint}</div>
            <div className="upload-card__placeholder-hint">{formatHint}</div>
          </div>
        )}
      </div>

      <button
        type="button"
        className="upload-card__btn-sub"
        onClick={triggerUpload}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span>{imagePreviewUrl ? changeLabel : buttonLabel}</span>
      </button>
    </div>
  );
};
