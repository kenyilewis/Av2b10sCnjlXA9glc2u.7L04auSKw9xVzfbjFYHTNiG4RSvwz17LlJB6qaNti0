import { Model, Types } from 'mongoose';
import { NewsfeedDocument } from "../../newsfeed/infrastructure/persistence/mongo-db/newsfeed.entity";

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sort?: any;
  select?: string;
}

export class Pagination {
  constructor(private readonly model: Model<any>) {}

  async paginate(
    query: any,
    options: IPaginationOptions = {},
    populate?: { propName: string; props: string },
  ) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, options.limit || 10);
    const skip = (page - 1) * limit;

    try {
      const totalCount = await this.model.countDocuments(query).exec();
      const totalPages = Math.ceil(totalCount / limit);

      let queryChain = this.model.find(query).skip(skip).limit(limit);

      if (options.sort) {
        queryChain = queryChain.sort(options.sort);
      }

      if (options.select) {
        queryChain = queryChain.select(options.select);
      }

      const results: NewsfeedDocument[] = await queryChain.exec();

      if (populate) {
        results.map(async (result) => {
          // @ts-ignore
          if(Types.ObjectId.isValid(result?.author)) {
            await result.populate(populate.propName, populate.props)
          }
        });
      }

      return {
        results,
        page,
        limit,
        totalCount,
        totalPages,
      };
    } catch (error) {
      throw new Error(`Pagination error: ${error.message}`);
    }
  }
}
