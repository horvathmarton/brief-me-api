import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { Article } from '../../shared/payloads/article.response';

interface NewsApiResponse<T = unknown> {
  status: string;
  totalResults: number;
  articles: T;
}

@Injectable()
export class NewsService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    if (!this.config.get('NEWS_API_KEY')) {
      throw new InternalServerErrorException('NEWS_API_KEY is note defined.');
    }
  }

  public async list(keywords: string[]): Promise<Article[]> {
    const keywordList = keywords.join(' OR ');
    const apiKey = this.config.get('NEWS_API_KEY');
    const queryParams = `q=${keywordList}&apiKey=${apiKey}&language=en&sortBy=relevancy`;

    const request = this.http
      .get<NewsApiResponse<Article[]>>(
        `https://newsapi.org/v2/everything?${queryParams}`,
      )
      .pipe(
        map((response) => response?.data?.articles),
        map((articles) => articles.map((article) => new Article(article))),
      );

    return firstValueFrom(request);
  }
}
