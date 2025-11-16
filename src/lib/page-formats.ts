export type PageFormat = {
  label: string;
  value: string;
  width: number;
  height: number;
};

export const PAGE_FORMATS: PageFormat[] = [
  {
    label: "A4",
    value: "a4",
    width: 595.28,
    height: 841.89,
  },
  {
    label: "Letter",
    value: "letter",
    width: 612,
    height: 792,
  },
  {
    label: "Legal",
    value: "legal",
    width: 612,
    height: 1008,
  },
  {
    label: "A3",
    value: "a3",
    width: 841.89,
    height: 1190.55,
  },
  {
    label: "A5",
    value: "a5",
    width: 420.94,
    height: 595.28,
  },
  {
    label: "Tabloid",
    value: "tabloid",
    width: 792,
    height: 1224,
  },
  {
    label: "Executive",
    value: "executive",
    width: 522,
    height: 756,
  },
  {
    label: "4x6",
    value: "4x6",
    width: 288,
    height: 432,
  },
  {
    label: "5x7",
    value: "5x7",
    width: 360,
    height: 504,
  },
  {
    label: "8x8 Square",
    value: "8x8",
    width: 576,
    height: 576,
  },
];
