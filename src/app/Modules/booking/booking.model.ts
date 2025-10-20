import { model, Schema } from "mongoose";
import { BOOKING_STATUS, IBooking } from "./booking.interface";

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      // in here we have take the types from schema and
      // in interface we have take the types from mongoose
      // this is a foreign key reference way
      type: Schema.Types.ObjectId,
      //   same as model of user named
      ref: "User",
      required: true,
    },
    tour: {
      type: Schema.Types.ObjectId,
      //   same as model of tour named
      ref: "Tour",
      required: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      //   same as model of tour named
      ref: "Payment",
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
    guestCount: {
      type: Number,
      //require because how many people should it be booked for
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = model<IBooking>("Booking", bookingSchema);
