import { Book } from 'epubjs';

const downloadAsset = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      resolve(this.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const getCoverImageBase64 = async (book: Book) => {
  const url = await book.loaded.cover;

  if (!url) return;

  const blobUrl = await book.archive.createUrl(url, { base64: false });

  if (!blobUrl) return;

  return downloadAsset(blobUrl);
};
