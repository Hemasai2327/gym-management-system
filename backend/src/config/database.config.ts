import { MongooseModule } from '@nestjs/mongoose';

export const DatabaseConfig = MongooseModule.forRootAsync({
  useFactory: () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('MONGO_URI is not defined');
    }

    return {
      uri,
    };
  },
});
