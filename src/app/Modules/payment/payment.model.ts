import { model, Schema } from "mongoose";
import { IPayment, PAYMENT_STATUS } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      //   booking id should be unique cuz
      // for one booking there would be for an user
      unique: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.UNPAID,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentGatewayData: {
      // why using mixed here
      // because in interface it is set to any and
      // no mater how the paymentgateway looks it won't
      // throw an error
      type: Schema.Types.Mixed,
    },
    invoiceUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Payment = model<IPayment>("Payment", paymentSchema);
