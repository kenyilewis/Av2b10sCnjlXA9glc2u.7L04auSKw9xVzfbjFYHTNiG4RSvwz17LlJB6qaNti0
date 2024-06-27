import { ConfigService } from '@nestjs/config';

export const mongooseConfig = async (configService: ConfigService) => {
  const { uri } = configService.get('config.mongoDB');
  return { uri };
};