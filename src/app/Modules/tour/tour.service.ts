import { Tour } from "./tour.model";
import { ITour } from "./tour.interface";

const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });

  if (existingTour) {
    throw new Error("Tour of this title already exists");
  }

  const baseSlug = payload.title.toLowerCase().split(" ").join("-");
  let slug = `${baseSlug}`;
  let counter = 0;
  while (await Tour.exists({ slug })) {
    slug = `${slug}-${counter++}`;
  }
  payload.slug = slug;

  const tour = await Tour.create(payload);
  return tour;
};

export const TourServices = {
  createTour,
};
