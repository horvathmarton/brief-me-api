import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, pluck } from 'rxjs';
import { Article, NewsListingPayload } from '../interfaces';

interface NewsApiResponse<T = unknown> {
  articles: {
    page: number;
    totalResults: number;
    pages: number;
    results: T;
  };
}

@Injectable()
export class NewsService {
  constructor(private readonly http: HttpService) {}

  public async list(keywords: string[]): Promise<Article[]> {
    const payload: NewsListingPayload = {
      action: 'getArticles',
      keyword: keywords,
      lang: 'eng',
      articlesPage: 1,
      articlesCount: 2,
      articlesSortBy: 'date',
      articlesSortByAsc: false,
      articlesArticleBodyLen: -1,
      resultType: 'articles',
      dataType: ['news', 'pr'],
      apiKey: process.env.NEWS_API_KEY,
      forceMaxDataTimeWindow: 31,
    };

    const request = this.http
      .get<NewsApiResponse<Article[]>>(
        `https://eventregistry.org/api/v1/article/getArticles`,
        {
          data: payload,
        },
      )
      .pipe(pluck('data', 'articles', 'results'));

    return firstValueFrom(request);
  }
}
