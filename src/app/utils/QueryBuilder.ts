import { Query } from "mongoose";
import { excludeField } from "./constants";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;

  // here this is record string string cuz it is record string string in the get all tours
  public readonly query: Record<string, string>;

  constructor(modelQuey: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuey;
    this.query = query;
  }

  // now we can create filter function here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter(): any {
    const filter = { ...this.query };
    // now we will add the for loop here
    for (const field of excludeField) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filter[field];
    }

    this.modelQuery = this.modelQuery.find(filter);
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
}
