// Declare global variables for libraries loaded from CDN
declare const pdfjsLib: any;
declare const mammoth: any;
declare const Tesseract: any;

// Set worker path for pdf.js, which is required for it to work from a CDN
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;
}


const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target?.result as string);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsText(file);
    });
};

const readPdfFile = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
    }
    return fullText;
};

const readDocxFile = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    return result.value;
};

const readImageFile = async (file: File): Promise<string> => {
    const worker = await Tesseract.createWorker('eng');
    const { data: { text } } = await worker.recognize(file);
    await worker.terminate();
    return text;
};


export const extractTextFromFile = async (file: File): Promise<string> => {
    try {
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
            return await readTextFile(file);
        } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
            return await readPdfFile(file);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
            return await readDocxFile(file);
        } else if (file.type.startsWith('image/')) {
            return await readImageFile(file);
        } else {
            console.warn(`Unsupported file type: ${file.type}. Trying to read as text.`);
            // Fallback for unknown file types that might be text-based
            return await readTextFile(file);
        }
    } catch (error) {
        console.error(`Error extracting text from ${file.name}:`, error);
        return `[Error extracting text from ${file.name}. The file might be corrupted or in an unsupported format.]`;
    }
};
