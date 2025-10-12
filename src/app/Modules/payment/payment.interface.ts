import { Types } from "mongoose";

export enum PAYMENT_STATUS {
  PAID = "PAID",
  UNPAID = "UNPAID",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface IPayment {
  booking: Types.ObjectId;
  transactionId: string; // unique like slug
  amount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentGatewayData?: any; //}-> why these two are optional?
  invoiceUrl?: string; //} ->because unpaid payment will be created and if we don't recive it will eventually cause and error
  status: PAYMENT_STATUS;
}
