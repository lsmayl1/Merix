import * as yup from "yup";
export const AuthSchema = yup.object().shape({
  fullName: yup.string().required("Full Name required!"),
  email: yup.string().email("Enter existing email").required("Email required!"),
  phone: yup.string().required("Number required!"),
  password: yup.string().min(6, "Password need have min 6 symbols"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password not match")
    .required("Confirm your password!"),
});
