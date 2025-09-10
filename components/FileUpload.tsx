import React, { useState, useCallback } from 'react';
import { extractTextFromFile } from '../services/fileProcessor';
import { FilePdfIcon, FileTextIcon, FileWordIcon, ImageIcon, UploadCloudIcon, XIcon } from './icons';

interface FileUploadProps {
    onTextExtracted: (text: string) => void;
    disabled: boolean;
}

const fileIcons: { [key: string]: React.ReactNode } = {
    'application/pdf': <FilePdfIcon className="h-6 w-6 text-red-400" />,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <FileWordIcon className="h-6 w-6 text-blue-400" />,
    'text/plain': <FileTextIcon className="h-6 w-6 text-gray-400" />,
    'image/jpeg': <ImageIcon className="h-6 w-6 text-purple-400" />,
    'image/png': <ImageIcon className="h-6 w-6 text-purple-400" />,
    'image/gif': <ImageIcon className="h-6 w-6 text-purple-400" />,
    'image/webp': <ImageIcon className="h-6 w-6 text-purple-400" />,
};

export const FileUpload: React.FC<FileUploadProps> = ({ onTextExtracted, disabled }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);

    const processFiles = useCallback(async (newFiles: FileList | null) => {
        if (!newFiles || newFiles.length === 0) return;
        
        setIsExtracting(true);
        const acceptedFiles = Array.from(newFiles);
        
        setFiles(prev => {
            const allFiles = [...prev, ...acceptedFiles];
            Promise.all(allFiles.map(extractTextFromFile)).then(texts => {
                onTextExtracted(texts.join('\n\n').trim());
                setIsExtracting(false);
            });
            return allFiles;
        });
    }, [onTextExtracted]);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled && !isExtracting) setIsDragging(true);
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
        if (!disabled && !isExtracting) {
            processFiles(e.dataTransfer.files);
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         processFiles(e.target.files);
         e.target.value = '';
    };

    const removeFile = (fileNameToRemove: string) => {
        const newFiles = files.filter(f => f.name !== fileNameToRemove);
        setFiles(newFiles);

        const reprocess = async () => {
            if (newFiles.length === 0) {
                onTextExtracted('');
            } else {
                setIsExtracting(true);
                const texts = await Promise.all(newFiles.map(extractTextFromFile));
                onTextExtracted(texts.join('\n\n').trim());
                setIsExtracting(false);
            }
        };
        reprocess();
    };
    
    const isBusy = disabled || isExtracting;
    
    return (
        <div>
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative flex flex-col justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-lg transition-all duration-300 text-center ${
                    isDragging ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/20' : 'border-white/20'
                } ${isBusy ? 'bg-black/20 cursor-not-allowed' : 'bg-black/10 cursor-pointer hover:border-purple-500'}`}
            >
                <input type="file" id="file-upload" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" multiple onChange={handleFileChange} disabled={isBusy} accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp" aria-label="File upload" />
                {isExtracting ? (
                     <>
                        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
                        <p className="mt-4 text-sm font-medium text-gray-300">Extracting text from files...</p>
                        <p className="text-xs text-gray-500 mt-1">This may take a moment for images or large documents.</p>
                     </>
                ) : (
                    <>
                        <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-500" />
                        <p className="mt-2 text-sm text-gray-400">
                            <span className="font-semibold text-pink-400">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF, DOCX, TXT, JPG, PNG & more</p>
                    </>
                )}
            </div>
            
            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    <h3 className="text-sm font-medium text-gray-300">Uploaded Files:</h3>
                    {files.map(file => (
                        <div key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between bg-black/30 p-2.5 rounded-lg border border-white/10">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                {fileIcons[file.type] || <FileTextIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />}
                                <div className="text-sm overflow-hidden">
                                    <p className="font-medium text-gray-200 truncate">{file.name}</p>
                                    <p className="text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            <button onClick={() => removeFile(file.name)} disabled={isBusy} className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-500/10 transition-colors flex-shrink-0 ml-2 disabled:opacity-50 disabled:cursor-not-allowed" aria-label={`Remove ${file.name}`}>
                                <XIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};