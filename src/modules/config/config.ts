import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    mongoDB: {
      uri: process.env.MONGO_URL,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
  };
});
