import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

// we will get it from query

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
const failPayment = async () => {
  // update booking status to FAIL
  // update payment status to FAIL
};
const cancelPayment = async () => {
  // update booking status to CANCEL
  // update payment status to CANCEL
};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
};
