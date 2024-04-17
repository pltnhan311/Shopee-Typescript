import { Omit } from 'lodash'
import { User } from '~/types/user.type'
import { SuccessResponse } from '~/types/utils.type'
import Http from '~/utils/http'

export interface BodyUpdateProfile extends Omit<User, '_id' | 'roles' | 'email' | 'createdAt' | 'updatedAt'> {
  password?: string
  newPassword?: string
}

export const getProfile = async () => {
  return await Http.get<SuccessResponse<User>>('me')
}

export const updateProfile = async (body: BodyUpdateProfile) => {
  return await Http.put<SuccessResponse<User>>('user', body)
}

export const uploadAvatar = async (body: FormData) => {
  return await Http.post<SuccessResponse<string>>('user/upload-avatar', body, {
    // khi dung form data phai truyen cai nay len
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
