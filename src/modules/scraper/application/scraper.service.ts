import { Inject, Injectable } from '@nestjs/common';
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

  @Cron(CronExpression.EVERY_HOUR)
  handleCron() {
    const elPaisUrl = 'https://elpais.com';
    const elMundoUrl = 'https://elmundo.es';
    const urlsFeeds = [elMundoUrl, elPaisUrl];
    console.info('Scraper job started <3');

    this.scrapeNews(urlsFeeds)
      .then((response) => {
        console.info('Scraper job finished <3', JSON.stringify(response));
      })
      .catch((error) => {
        console.error('Error scraping news', error);
      });
  }

  async scrapeNews(urlsFeeds: Array<string>): Promise<void> {
    try {
      const data = await Promise.all(
        urlsFeeds.map((url) => this.scrapeNewsfeed(url)),
      );

      const newsfeeds = data.flat();
      console.info(`Scraped ${newsfeeds.length} news`, newsfeeds);

      const response = await this.newsfeedRepository.createNewsfeedList(
        newsfeeds,
      );
      console.info('News saved in the database', response);
    } catch (error) {
      console.error('Error scraping news', error);
    }
  }

  private async scrapeNewsfeed(newsfeedUrl: string): Promise<any[]> {
    const { data } = await axios.get(newsfeedUrl);
    const $ = cheerio.load(data);
    const news = [];

    $('article').each((index, element) => {
      const newsfeed = newsfeedCollect(index, element, newsfeedUrl, $);
      if (newsfeed) {
        news.push(newsfeed);
      }
    });

    return news;
  }
}
