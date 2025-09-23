import { User, Op } from "../../models/index.js";
import AppError from "../../utils/AppError.js";

const CreateUser = async (userData) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = userData;

    // Check if user with the same email or phone number already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phoneNumber }],
      },
    });
    if (existingUser) {
      throw new AppError(
        "User with this email or phone number already exists",
        400
      );
    }
	if(firstName.length < 2 || lastName.length < 2){
		throw new AppError("First name and last name must be at least 2 characters long", 400);
	}else if(password.length < 6){
		throw new AppError("Password must be at least 6 characters long", 400);
	}else if(!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)){
		throw new AppError("Invalid email format", 400);
	}else if(!/^\+?[1-9]\d{1,14}$/.test(phoneNumber)){
		throw new AppError("Invalid phone number format", 400);
	}
	

    const user = await User.create(userData);
    return user;
  } catch (error) {
    throw error;
  }
};
export { CreateUser };
