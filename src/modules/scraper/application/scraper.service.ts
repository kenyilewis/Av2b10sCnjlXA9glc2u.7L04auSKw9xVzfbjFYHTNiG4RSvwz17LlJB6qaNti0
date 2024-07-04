import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ScraperService {
  constructor(
    @Inject('NewsfeedRepository')
    private readonly newsfeedRepository: NewsfeedRepository,
  ) {}

  private readonly logger = new Logger(ScraperService.name);

  @Cron(CronExpression.EVERY_HOUR)
  handleCron() {
    const elPaisUrl = 'https://elpais.com/';
    const elMundoUrl = 'https://www.elmundo.es/';
    const urlsFeeds = [elPaisUrl, elMundoUrl];
    this.logger.debug('Running the scraper job');
    this.scrapeNews(urlsFeeds);
  }

  async scrapeNews(urlsFeeds: Array<string>): Promise<void> {
    const data = await Promise.all(
      urlsFeeds.map((url) => this.scrapeFeed(url)),
    );

    const feeds = data.flat();
    this.logger.log(`Scraped ${feeds.length} feeds`);

   // TODO: Save the feeds in the database
  }

  private async scrapeFeed(url: string): Promise<any[]> {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const news = [];

    $('.headline').each((index, element) => {
      if (index < 5) {
        const title = $(element).text().trim();
        const link = $(element).find('a').attr('href');
        news.push({ title, link, source: 'El País' });
      }
    });

    return news;
  }
}
