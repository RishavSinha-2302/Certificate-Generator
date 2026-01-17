export type CsvData = {
  headers: string[];
  rows: Record<string, string>[];
};

export type Mapping = {
  id: string;
  csvColumn: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  color: string;
  fontFamily: string;
};

export type Template = {
  id: string;
  name: string;
  url: string;
};
