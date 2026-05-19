/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { getTransactionId } from "../../utils/getTransactionId";

/* 
  ..What transaction roll back will do?
 => 1. it will Duplicate DB collections/ replica
     it will create a virtual box [create booking -> create payment -> update booking] 
  so here it will take 3 time write operations here
  now we are in virtual environment  which is outside of real envs
  and when a error gets thrown in that box way the whole box will disappear.
  and if it is successful then that environment will get inserted into Real DB/Original database
*/

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  //   for passing this to payment
  const transactionId = getTransactionId();

  // why doing this?
  //=> we are doing write operation on booking first so
  //  so that's why we have created the session on top of booking here
  // this will create a replica
  const session = await Booking.startSession();
  session.startTransaction();

  /*  why using try catch block here regardless of having 
 catch async on the controller. controller catch async
 will catch the error from the business logic of it 
 but here we can handle the failure of the database
 for manipulating the database if there is an error
 it gets deleted so catch async will not know that
 here is another business logic for that 
 we are using try catch block  
*/
  try {
    // ! we will not use session in get/read operation
    const user = await User.findById(userId);

    if (!user?.phone || !user.address) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Please Update Your profile to Book a Tour",
      );
    }

    // ! we will not use session in get/ read operation
    const tour = await Tour.findById(payload.tour).select("costFrom");

    if (!tour?.costFrom) {
      throw new AppError(StatusCodes.BAD_REQUEST, "No Tour cost Found!!");
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const amount = Number(tour.costFrom) * Number(payload.guestCount!);

    // here we are doing the create operation in virtual environment first

    const booking = await Booking.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session },
    );

    const payment = await Payment.create(
      [
        {
          //! careful if we don't give the 0 index we won't get the access
          booking: booking[0]._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId: transactionId,
          amount: amount,
        },
      ],
      { session },
    );

    const updatedBooking = await Booking.findByIdAndUpdate(
      //! careful if we don't give the 0 index we won't get the access
      booking[0]._id,
      {
        //! careful if we don't give the 0 index we won't get the access
        payment: payment[0]._id,
      },
      // also add session here
      { new: true, runValidators: true, session },
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    // SSL Commerz
    const userAddress = (updatedBooking?.user as any).address;
    const userEmail = (updatedBooking?.user as any).email;
    const userPhoneNumber = (updatedBooking?.user as any).phone;
    const userName = (updatedBooking?.user as any).name;

    const sslPayload: ISSLCommerz = {
      address: userAddress,
      email: userEmail,
      phoneNumber: userPhoneNumber,
      name: userName,
      amount: amount,
      transactionId: transactionId,
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);

    // this means you have to promise this to the database and insert it
    await session.commitTransaction(); // this is transaction
    // and finally after completing this endSession
    session.endSession();

    return {
      // so FRONTEND Will redirect to this url
      paymentUrl: sslPayment.GatewayPageURL,
      booking: updatedBooking,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // this will close every session
    await session.abortTransaction(); // this is rollback
    session.endSession();
    // don not use appError heres
    throw error;
  }
};

/* 
 what will ssl commerz have here?
 This is what will happen if the payment is success :-
 => frontend(localhost:5173) -> user -> Tour -> Booking (PENDING) -> payment(UNPAID) -> it will 
 go to SSLCommerz page -> Payment Complete -> Backend Route 
 -> Update Payment(PAID) & Booking(CONFIRM) -> redirect to frontend -> Frontend(localhost:5173/payment/success)

 This is what will happen if the payment is unsuccessful due to an error :

  => frontend(localhost:5173) -> user -> Tour -> Booking (PENDING) -> payment(UNPAID) -> it will 
 go to SSLCommerz page -> Payment failed -> Backend(localhost:5000) Route 
 -> Update Payment(FAIL/CANCEL) & Booking(FAIL/CANCEL) -> redirect to frontend -> Frontend(localhost:5173/payment/cancel or localhost:5173/payment/fail)
 */

const getUserBookings = async () => {
  return {};
};

const getBookingById = async () => {
  return {};
};

const updateBookingStatus = async () => {
  return {};
};

const getAllBookings = async () => {
  return {};
};

export const BookingService = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  getAllBookings,
};
