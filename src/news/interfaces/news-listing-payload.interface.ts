export interface NewsListingPayload {
  action: string;
  keyword: string | string[];
  lang?: 'eng';
  articlesPage: number;
  articlesCount: number;
  articlesSortBy: string;
  articlesSortByAsc: boolean;
  articlesArticleBodyLen: number;
  resultType: string;
  dataType: string[];
  apiKey: string;
  forceMaxDataTimeWindow: number;
}
