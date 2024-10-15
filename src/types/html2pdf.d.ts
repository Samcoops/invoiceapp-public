declare module 'html2pdf.js' {
    interface Html2PdfOptions {
        margin?: number | [number, number, number, number];
        filename?: string;
        image?: { type: string; quality: number };
        html2canvas?: { scale: number; useCORS?: boolean };
        jsPDF?: { unit: string; format: string | [number, number]; orientation: string };
    }

    interface Html2Pdf {
        from(element: HTMLElement | string): Html2Pdf;
        set(options: Html2PdfOptions): Html2Pdf;
        save(): void;
        outputPdf(value): Html2Pdf;
        then(pdfUrl): Html2Pdf;
        output(pdfDataUri): Html2Pdf;
        catch(error): Html2Pdf;
    }

    const html2pdf: () => Html2Pdf;
    export default html2pdf;
}
