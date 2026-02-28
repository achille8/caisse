import { toast } from 'react-toastify';

export function rightAlignNumber(num: number, totalWidth: number, decimals: number = 0, paddingChar = ' '): string {
  const numberString = num.toFixed(decimals);
  const padding = Math.max(0, totalWidth - numberString.length);
  return paddingChar.repeat(padding) + numberString;
}

export function leftAlignText(text: string, totalWidth: number, paddingChar = ' '): string {
  const padding = Math.max(0, totalWidth - text.length);
  return (text + paddingChar.repeat(padding)).substring(0, totalWidth);
}

export function displayMessage(message: string): void {
  toast.info(message, { theme: 'success', position: 'top-left', delay: 2000  });
}

export function displayError(message: string): void {
  toast.error(message, { theme: 'error', position: 'top-left' });
}
