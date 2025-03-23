import { LOGIN_URL, SIGNUP_URL } from "../config/config";
import { LoginFormType, SignupFormType } from "../types";
import { POST } from "./requestHandler"

export const login = async (form: LoginFormType) => {
  return POST(LOGIN_URL, form)
    .then((data) => data)
    .catch(error => { throw new Error(error.message.split(',')[0])});
}

export const signup = async (form: SignupFormType) => {
  return POST(SIGNUP_URL, form)
    .then((data) => data)
    .catch(error => { throw new Error(error.message.split(',')[0])});
}