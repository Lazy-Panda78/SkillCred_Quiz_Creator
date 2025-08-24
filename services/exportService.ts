
import type { QuizData } from '../types';

// These are loaded from CDNs, so we declare them to satisfy TypeScript
declare const jspdf: any;
declare const html2canvas: any;
declare const docx: any;
declare const saveAs: any;

export const exportToPdf = (quizData: QuizData) => {
    const { jsPDF } = jspdf;
    const quizElement = document.getElementById('quiz-to-export');
    
    if (!quizElement) {
        console.error("Quiz element for export not found");
        return;
    }

    // Make the element visible for capturing, but off-screen
    quizElement.style.display = 'block';
    quizElement.style.position = 'absolute';
    quizElement.style.left = '-9999px';


    html2canvas(quizElement, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const imgWidth = pdfWidth - 20; // with margin
        const imgHeight = imgWidth / ratio;
        
        let heightLeft = imgHeight;
        let position = 10;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 20);

        while (heightLeft > 0) {
            position -= (pdfHeight - 20);
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= (pdfHeight - 20);
        }
        
        pdf.save('quiz.pdf');
        
        // Hide element after capture
        quizElement.style.display = 'hidden';
        quizElement.style.position = 'static';
        quizElement.style.left = 'auto';
    });
};

export const exportToDocx = (quizData: QuizData) => {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, Numbering, Indent, AlignmentType } = docx;

    const doc = new Document({
        numbering: {
            config: [
                {
                    reference: "quiz-numbering",
                    levels: [
                        {
                            level: 0,
                            format: "decimal",
                            text: "%1.",
                            alignment: AlignmentType.START,
                            style: {
                                paragraph: {
                                    indent: { left: 720, hanging: 360 },
                                },
                            },
                        },
                    ],
                },
            ],
        },
        sections: [{
            children: [
                new Paragraph({
                    text: "Quiz",
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({ text: "" }), // spacing
                ...(quizData.multipleChoice.length > 0 ? [
                    new Paragraph({
                        text: "Multiple-Choice Questions",
                        heading: HeadingLevel.HEADING_2,
                    }),
                    ...quizData.multipleChoice.flatMap((q, index) => [
                        new Paragraph({
                            text: q.question,
                            numbering: {
                                reference: "quiz-numbering",
                                level: 0,
                            },
                        }),
                        new Paragraph({ text: `A) ${q.options.a}`, indent: { left: 720 } }),
                        new Paragraph({ text: `B) ${q.options.b}`, indent: { left: 720 } }),
                        new Paragraph({ text: `C) ${q.options.c}`, indent: { left: 720 } }),
                        new Paragraph({ text: `D) ${q.options.d}`, indent: { left: 720 } }),
                        new Paragraph({ text: "" }),
                    ]),
                ] : []),
                 ...(quizData.trueFalse.length > 0 ? [
                    new Paragraph({
                        text: "True/False Questions",
                        heading: HeadingLevel.HEADING_2,
                    }),
                    ...quizData.trueFalse.flatMap((q, index) => [
                        new Paragraph({
                            text: q.question,
                             numbering: {
                                reference: "quiz-numbering",
                                level: 0,
                            },
                        }),
                        new Paragraph({ text: "" }),
                    ]),
                ] : []),
            ],
        }],
    });

    Packer.toBlob(doc).then(blob => {
        saveAs(blob, "quiz.docx");
    });
};
