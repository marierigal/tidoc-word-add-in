export class PDFExportService {
  public static async export(filename: string = 'document.pdf'): Promise<void> {
    const bytes = await PDFExportService.getPdfAsBase64();
    PDFExportService.downloadPdf(bytes, filename);
  }

  private static getPdfAsBase64(): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      Office.context.document.getFileAsync(Office.FileType.Pdf, { sliceSize: 65536 }, result => {
        if (result.status !== Office.AsyncResultStatus.Succeeded) {
          reject(result.error);
          return;
        }

        const file = result.value;
        const sliceCount = file.sliceCount;
        const slices: number[][] = new Array(sliceCount);
        let receivedCount = 0;

        for (let i = 0; i < sliceCount; i++) {
          file.getSliceAsync(i, sliceResult => {
            if (sliceResult.status !== Office.AsyncResultStatus.Succeeded) {
              file.closeAsync();
              reject(sliceResult.error);
              return;
            }

            slices[sliceResult.value.index] = sliceResult.value.data;
            receivedCount++;

            if (receivedCount === sliceCount) {
              file.closeAsync();
              const merged = slices.flat();
              resolve(new Uint8Array(merged));
            }
          });
        }
      });
    });
  }

  private static downloadPdf(bytes: Uint8Array, filename: string): void {
    const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  }
}
