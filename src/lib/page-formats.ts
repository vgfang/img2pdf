export type PageFormat = {
  label: string;
  value: string;
  widthIn: number;
  heightIn: number;
};

// widthIn/heightIn is in inches
export const PAGE_FORMATS: PageFormat[] = [
  { label: 'A4', value: 'a4', widthIn: 8.27, heightIn: 11.69 },
  { label: 'Letter', value: 'letter', widthIn: 8.5, heightIn: 11 },
  { label: 'Legal', value: 'legal', widthIn: 8.5, heightIn: 14 },
  { label: 'A3', value: 'a3', widthIn: 11.69, heightIn: 16.54 },
  { label: 'A5', value: 'a5', widthIn: 5.83, heightIn: 8.27 },
  { label: 'Tabloid', value: 'tabloid', widthIn: 11, heightIn: 17 },
  { label: 'Executive', value: 'executive', widthIn: 7.25, heightIn: 10.5 },
  { label: '4x6', value: '4x6', widthIn: 4, heightIn: 6 },
  { label: '5x7', value: '5x7', widthIn: 5, heightIn: 7 },
  { label: '8x8 Square', value: '8x8', widthIn: 8, heightIn: 8 },
];
