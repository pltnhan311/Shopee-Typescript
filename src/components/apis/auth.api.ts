import path from '../constants/path';
import { AuthResponse } from '../types/auth.type'
import Http from '../utils/http'

export const registerAccount = async (body: { email: string; password: string }) => {
  return await Http.post<AuthResponse>(path.register, body)
}

export const loginAccount = async (body: { email: string; password: string }) => {
  return await Http.post<AuthResponse>(path.login, body)
}

export const logoutAccount = async () => {
  return await Http.post(path.logout)
}
