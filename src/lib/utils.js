// src/lib/utils.js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * פונקציית עזר למיזוג סגנונות Tailwind
 * משלבת סגנונות מרובים תוך מניעת התנגשויות בין מחלקות
 * 
 * @param  {...string} inputs - מחלקות CSS להוספה
 * @returns {string} - מחלקות CSS ממוזגות
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}