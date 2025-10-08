import { Query } from "mongoose";
import { excludeField } from "./constants";

export default class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;

  // here this is record string string cuz it is record string string in the get all tours
  public readonly query: Record<string, string>;

  constructor(modelQuey: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuey;
    this.query = query;
  }

  // now we can create filter function here

  filter(): this {
    const filter = { ...this.query };
    // now we will add the for loop here
    for (const field of excludeField) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filter[field];
    }

    this.modelQuery = this.modelQuery.find(filter);

    return this;
  }

  search(searchableField: string[]): this {
    const searchTerm = this.query.searchTerm || "";

    const searchQuery = {
      $or: searchableField.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    };

    this.modelQuery = this.modelQuery.find(searchQuery);

    return this;
  }

  sort(): this {
    const sort = this.query.sort || "-createdAt";

    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }

  // now in same way we will do the paginate and field selection

  fields(): this {
    // for fields we need this and select
    const fields = this.query.fields?.split(",").join(" ") || "";

    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }

  paginate(): this {
    // for pagination we will need this three variables
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    // this is important
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  // this is for reducing the mistake of not giving the .modelQuery;
  build() {
    return this.modelQuery;
  }

  // now we will create the getMeta which is meta data
  // so for that we will do it in query builder for that
  // we will create a function here like this :
  // we have to call async like this cuz we are using method and inside it
  // we are using function so we have to use it like this :
  async getMeta() {
    const totalDocuments = await this.modelQuery.model.countDocuments();

    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    const totalPage = Math.ceil(totalDocuments / limit);

    return { page, limit, total: totalDocuments, totalPage };
  }
}
