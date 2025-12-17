export interface QuestionMapping {
  index: number;
  pdfContent: string;
  originalChapter: string;
  novelQuoteOrSummary: string;
}

export interface ChapterMapping {
  id: number;
  pdfTitle: string;
  originalChapters: string; // e.g., "第3-7回"
  startChapter: number; // For sorting
  keyEvents: string[];
  novelContext: string;
  pdfOrder: number;
  questions: QuestionMapping[];
}

export enum SortMode {
  PDF_ORDER = 'PDF_ORDER',
  NOVEL_ORDER = 'NOVEL_ORDER'
}