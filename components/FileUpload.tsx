
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon, DocumentIcon } from './Icons';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null) => {
    if (file && file.type === 'application/pdf') {
      setFileName(file.name);
      onFileChange(file);
    } else {
      setFileName(null);
      onFileChange(null);
      // Optional: show an error message for non-PDF files
    }
  }, [onFileChange]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  }

  return (
    <div>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
          ${isDragging ? 'border-brand-accent bg-brand-secondary/20' : 'border-gray-600 hover:border-brand-accent hover:bg-neutral-medium/50'}`}
      >
        <div className="text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-gray-400"/>
          <p className="mt-1 text-sm text-gray-400">
            <span className="font-semibold text-brand-accent">Clique para carregar</span> ou arraste e solte o arquivo
          </p>
          <p className="text-xs text-gray-500">Apenas arquivos PDF são permitidos</p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={handleChange}
          />
        </div>
      </div>
      {fileName && (
        <div className="mt-4 flex items-center justify-center bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-lg">
          <DocumentIcon className="h-5 w-5 mr-3"/>
          <p className="text-sm font-medium">Arquivo selecionado: <span className="font-normal">{fileName}</span></p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
