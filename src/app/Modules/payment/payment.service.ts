/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import mongoose from "mongoose";

// we will get it from query

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });

  if (!payment) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Payment Not Found. You did not booked this tour"
    );
  }

  const booking = await Booking.findById(payment.booking);

  // SSL Commerz
  const userAddress = (booking?.user as any).address;
  const userEmail = (booking?.user as any).email;
  const userPhoneNumber = (booking?.user as any).phone;
  const userName = (booking?.user as any).name;

  const sslPayload: ISSLCommerz = {
    address: userAddress,
    email: userEmail,
    phoneNumber: userPhoneNumber,
    name: userName,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };

  const sslPayment = await SSLService.sslPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};

const successPayment = async (query: Record<string, string>) => {
  // update booking status to confirm
  // update payment status to PAID

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // first parameter will have which payment are we updating
    // second parameter will have what we are upgrading
    // third parameter will have the session

    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      // find will not have array here
      {
        status: PAYMENT_STATUS.PAID,
      },

      { new: true, runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking._id,
      {
        status: BOOKING_STATUS.COMPLETE,
      },
      // also add session here
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    await session.commitTransaction();

    session.endSession();

    return {
      success: true,
      message: "Payment Completed Successfully",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const failPayment = async (query: Record<string, string>) => {
  // update booking status to FAIL
  // update payment status to FAIL

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // first parameter will have which payment are we updating
    // second parameter will have what we are upgrading
    // third parameter will have the session

    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      // find will not have array here
      {
        status: PAYMENT_STATUS.FAILED,
      },

      { new: true, runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking._id,
      {
        status: BOOKING_STATUS.FAILED,
      },
      // also add session here
      { runValidators: true, session }
    );

    await session.commitTransaction();

    session.endSession();

    return {
      success: false,
      message: "Payment Failed",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const cancelPayment = async (query: Record<string, string>) => {
  // update booking status to CANCEL
  // update payment status to CANCEL

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // first parameter will have which payment are we updating
    // second parameter will have what we are upgrading
    // third parameter will have the session

    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      // find will not have array here
      {
        status: PAYMENT_STATUS.CANCELLED,
      },

      { new: true, runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking._id,
      {
        status: BOOKING_STATUS.CANCEL,
      },
      // also add session here
      { runValidators: true, session }
    );

    await session.commitTransaction();

    session.endSession();

    return {
      success: false,
      message: "Payment Cancelled",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};



export const PaymentService = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
};
