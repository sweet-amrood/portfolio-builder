const MAX_FILE_BYTES = 5 * 1024 * 1024;
const JPEG_QUALITY = 0.85;

export function readImageFile(file, { maxDimension = 480 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith('image/')) {
      reject(new Error('Please choose an image file.'));
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      reject(new Error('Image must be smaller than 5 MB.'));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Could not read the image file.'));
    reader.onload = () => {
      const img = new Image();

      img.onerror = () => reject(new Error('Could not load the image.'));
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not process the image.'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}

export function readProfileImage(file) {
  return readImageFile(file, { maxDimension: 480 });
}

export function readProjectImage(file) {
  return readImageFile(file, { maxDimension: 960 });
}
