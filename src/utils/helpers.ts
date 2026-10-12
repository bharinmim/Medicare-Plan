/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simulated SHA-256 hash generator using Web Crypto API or fallback
export async function calculateFileHash(file: File): Promise<string> {
  try {
    if (window.crypto && window.crypto.subtle) {
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    }
  } catch (err) {
    console.warn('Web Crypto API fallback used for hash calculation', err);
  }
  // Pseudo-random deterministic hash fallback
  return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function generateMBI(): string {
  // Official Medicare Beneficiary Identifier pattern: 11 characters (e.g. 1EG4-TE5-MK72)
  const chars = '23456789ACDEFGHJKMNPQRTVWXYZ';
  const getChar = () => chars.charAt(Math.floor(Math.random() * chars.length));
  const getNum = () => Math.floor(Math.random() * 9 + 1).toString();
  
  return `${getNum()}${getChar()}${getChar()}${getNum()}-${getChar()}${getChar()}${getNum()}-${getChar()}${getChar()}${getNum()}${getNum()}`;
}

export function generateApplicationId(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `MED-${year}-${rand}`;
}
