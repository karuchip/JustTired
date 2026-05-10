export type StampType = {
  id: number;
  text: string;
  left: number;
}

export type WordType = {
  id: number;
  word: string;
}

export type TiredItemType = {
  id: number;
  text: string;
  created_at: Date;
}

export type CountItemType = {
  daily_count: number;
  total_count: number;
}
