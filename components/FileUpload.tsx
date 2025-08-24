
import React, { useState, useCallback } from 'react';
import { extractTextFromFile } from '../services/fileProcessor';
import { FilePdfIcon, FileTextIcon, FileWordIcon, ImageIcon, UploadCloudIcon, XIcon } from './icons';

interface FileUploadProps {
    onTextExtracted: (text: string) => void;
    disabled: boolean;
}

const fileIcons: { [key: string]: React.ReactNode } = {
    'application/pdf': <FilePdfIcon className="h-6 w-6 text-red-500" />,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <FileWordIcon className="h-6 w-6 text-blue-500" />,
    'text/plain': <FileTextIcon className="h-6 w-6 text-gray-500" />,
    'image/jpeg': <ImageIcon className="h-6 w-6 text-purple-500" />,
    'image/png': <ImageIcon className="h-6 w-6 text-purple-500" />,
    'image/gif': <ImageIcon className="h-6 w-6 text-purple-500" />,
    'image/webp': <ImageIcon className="h-6 w-6 text-purple-500" />,
};

export const FileUpload: React.FC<FileUploadProps> = ({ onTextExtracted, disabled }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const processFiles = useCallback(async (newFiles: FileList | null) => {
        if (!newFiles || newFiles.length === 0) return;
        const acceptedFiles = Array.from(newFiles);
        setFiles(acceptedFiles);

        let combinedText = '';
        for (const file of acceptedFiles) {
            const text = await extractTextFromFile(file);
            combinedText += text + '\n\n';
        }
        onTextExtracted(combinedText.trim());
    }, [onTextExtracted]);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setIsDragging(true);
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
        if (!disabled) {
            processFiles(e.dataTransfer.files);
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         processFiles(e.target.files);
    };

    const removeFile = (fileName: string) => {
        const newFiles = files.filter(f => f.name !== fileName);
        setFiles(newFiles);
        if (newFiles.length === 0) {
            onTextExtracted('');
        } else {
             const remainingFiles = new FileList();
             // This is a bit of a hack as FileList is immutable, but for the mock it's okay.
             // We'll re-process the remaining files.
             Promise.all(newFiles.map(extractTextFromFile)).then(texts => {
                 onTextExtracted(texts.join('\n\n').trim());
             });
        }
    };
    
    return (
        <div>
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-lg transition-colors duration-200 ${
                    isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer hover:border-gray-400'}`}
            >
                <input type="file" id="file-upload" className="hidden" multiple onChange={handleFileChange} disabled={disabled} accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp" />
                <label htmlFor="file-upload" className={`text-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                    <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                        <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, TXT, JPG, PNG, etc.</p>
                </label>
            </div>
            
            <div className="mt-4 flex items-center justify-center space-x-4">
                <FilePdfIcon className="h-6 w-6 text-red-500" />
                <FileWordIcon className="h-6 w-6 text-blue-500" />
                <FileTextIcon className="h-6 w-6 text-gray-500" />
                <ImageIcon className="h-6 w-6 text-purple-500" />
            </div>

            {files.length > 0 && (
                <div className="mt-6 space-y-2">
                    {files.map(file => (
                        <div key={file.name} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border">
                            <div className="flex items-center space-x-3">
                                {fileIcons[file.type] || <FileTextIcon className="h-6 w-6 text-gray-500" />}
                                <div className="text-sm">
                                    <p className="font-medium text-gray-800">{file.name}</p>
                                    <p className="text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            <button onClick={() => removeFile(file.name)} className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors">
                                <XIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
