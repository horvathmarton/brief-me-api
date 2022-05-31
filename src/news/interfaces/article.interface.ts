import { NewsSource } from './news-source.interface';

export interface Article {
  uri: string;
  lang: string;
  isDuplicate: boolean;
  date: string;
  time: string;
  dateTime: Date;
  dateTimePub: Date;
  dataType: string;
  sim: number;
  url: string;
  title: string;
  body: string;
  source: NewsSource;
  authors: string[];
  image: string;
  eventUri: string | null;
  sentiment: number | null;
  wgt: number;
  relevance: number;
}
