import { Schema } from "mongoose";
import { BOOKING_STATUS, IBooking } from "./booking.interface";

const bookingSchema = new Schema<IBooking>(
  {
    user: {
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
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
    guestCount : {
        type : Number,
        required: 
    }
  },
  {
    timestamps: true,
  }
);
