import { Types } from "mongoose";

export interface ITourType {
  name: string;
}

export interface ITour {
  title: string;
  slug: string;
  description?: string;
  // because we are using cloudinary we will use this images here
  images?: string[];
  location?: string;
  costFrom?: number;
  startDate?: Date;
  endDate?: Date;
  departureLocation?: string;
  arrivalLocation?: string;
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  tourPlan?: string[];
  maxGuest?: number;
  minAge?: number;
  division: Types.ObjectId;
  //   tour type will have different collection it will help you for
  // filtering so we will set it to Types.ObjectID
  tourType: Types.ObjectId;
}
