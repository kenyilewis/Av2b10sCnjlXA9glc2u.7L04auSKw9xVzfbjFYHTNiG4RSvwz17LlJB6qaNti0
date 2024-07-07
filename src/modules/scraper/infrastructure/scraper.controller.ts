import { Controller, Get } from '@nestjs/common';

import { ScraperService } from '../application/scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  // TODO: Implement the controller method to test the scraper :D
  @Get()
  async scrapeNews() {
    return this.scraperService.handleCron();
  }
}
