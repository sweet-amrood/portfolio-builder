const MAX_RESUME_BYTES = 3 * 1024 * 1024;

export function readResumeFile(file) {
  return new Promise((resolve, reject) => {
    const isPdf =
      file?.type === 'application/pdf' || file?.name?.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      reject(new Error('Please choose a PDF file.'));
      return;
    }

    if (file.size > MAX_RESUME_BYTES) {
      reject(new Error('Resume must be smaller than 3 MB.'));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Could not read the resume file.'));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

export function isUploadedResume(value) {
  return typeof value === 'string' && value.startsWith('data:application/pdf');
}
