import crypto from "crypto"
import { redisClient } from "../../config/redis.config"
import { sendEmail } from "../../utils/sendEmail"
import AppError from "../../errorHelpers/AppError"
import { User } from "../user/user.model"

// first we will need the otp expiration
const OTP_EXPIRATION = 2 * 60 // 2 MIN  TIMER

//length parameter set to 6 as default if it's not given
const generateOtp = (length = 6) => {
    //6 digit otp 
    // this randomInt gives us n digit integer which will have minimum value to maximum value it will provide us the value
    // here we are using ** because by using it means power 10 to the power 5 something like that because length = 6 that's why
    // we will provide this as like a stringified way so that's why in the end we have to make it toString
    const otp = crypto.randomInt(10 ** (length-1),10 ** length).toString()

    return otp
}

const sendOTP = async (email: string, name: string) => {

    const user = await User.findOne({email})

    // if the user does not exist
    if (!user){
        throw new AppError(404, "User not found")
    }

    // if the user is already verified
    if (user.isVerified){
        throw new AppError(401, "You are already verified")
    }


    const otp = generateOtp();

// redis key should be unique for user
// what redis recommend us to do is here otp is prefix then the dynamic way in prefix we will set the email as prefix
    const redisKey  = `otp:${email}`

    //  what set does here is..
    //Set key to hold the string value. If key already holds a value, it is overwritten, regardless of its type. Any previous time to live associated with the key is discarded on successful SET operation.
    await redisClient.set(redisKey, otp, {
        expiration : {
            type: "EX",
            value: OTP_EXPIRATION
        }
    })

    // now the otp is ready it's time to send it to the email 

    await sendEmail({
        to: email, 
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name: name,
            otp:  otp,
        }
    })
}

 const verifyOTP = async (email: string, otp: string)  => {

 const user = await User.findOne({email})

    // if the user does not exist
    if (!user){
        throw new AppError(404, "User not found")
    }

    // if the user is already verified
    if (user.isVerified){
        throw new AppError(401, "You are already verified")
    }


    const redisKey = `otp:${email}`

    const savedOtp = await redisClient.get(redisKey)

    if (!savedOtp){
        throw new AppError(401, "Invalid OTP");
    }

    if (savedOtp !== otp) {
        throw new AppError(401,  "Invalid OTP")
    }

    // update one here cuz the otp will be verified  so we need to update the isVerified to true
    

    await Promise.all([
User.updateOne({email}, {isVerified: true}, {runValidators: true}),
redisClient.del([redisKey])
    ])

    return {};
}

export const OTPService = {
    sendOTP,
    verifyOTP
}