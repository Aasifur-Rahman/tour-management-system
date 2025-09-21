export interface IDivision {
  name: string;
  slug: string;
  thumbnail?: string;
  description?: string;
}

// what is slug here
// if division name is chattogram
// the slug will make it like slug = chattogram-division
// slug will search like this /:slug
//  /division/chattogram-division <- this is the slug here
