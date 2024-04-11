import { AuthResponse } from '../types/auth.type'
import Http from '../utils/http'

export const registerAccount = async (body: { email: string; password: string }) => {
  return await Http.post<AuthResponse>('/register', body)
}
