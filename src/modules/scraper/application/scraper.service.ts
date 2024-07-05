import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import * as cheerio from 'cheerio';

import { NewsfeedRepository } from '../../newsfeed/infrastructure/persistence/mongo-db/newsfeed.repository';
import { newsfeedCollect } from './utils';

@Injectable()
export class ScraperService {
  constructor(
    @Inject('NewsfeedRepository')
    private readonly newsfeedRepository: NewsfeedRepository,
  ) {}

  private readonly logger = new Logger(ScraperService.name);

  @Cron(CronExpression.EVERY_HOUR)
  handleCron() {
    const elPaisUrl = 'https://elpais.com';
    const elMundoUrl = 'https://elmundo.es';
    const urlsFeeds = [elMundoUrl];
    this.logger.debug('Running the scraper job :D');

    this.scrapeNews(urlsFeeds).then((response) => {
      this.logger.debug('Scraper job finished <3', JSON.stringify(response));
    }).catch((error) => {
      this.logger.error('Error scraping news', error);
    });
  }

  async scrapeNews(urlsFeeds: Array<string>): Promise<void> {
    const data = await Promise.all(
      urlsFeeds.map((url) => (this.scrapeNewsfeed(url))),
    );

    const newsfeeds = data.flat();
    this.logger.log(`Scraped ${newsfeeds.length} news`);

    await this.newsfeedRepository.createNewsfeedList(newsfeeds);
  }

  private async scrapeNewsfeed(newsfeedUrl: string, options?): Promise<any[]> {
    const { data } = await axios.get(newsfeedUrl);
    const $ = cheerio.load(data);
    const news = [];

    // @ts-ignore
    $('article').each((index, element) => {
        const newsfeed = newsfeedCollect(index, element, newsfeedUrl, $);
        if (newsfeed) {
          news.push(newsfeed);
      }
        return news;
    });

    return news;
  }
}
