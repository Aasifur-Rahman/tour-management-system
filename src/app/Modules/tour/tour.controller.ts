import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourServices } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";

const createTour = catchAsync(async (req: Request, res: Response) => {
  const result = await TourServices.createTour(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour created successfully",
    data: result,
  });
});

export const TourController = {
  createTour,
};
