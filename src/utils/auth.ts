import { User } from '../types/user.type'

export const LocalStorageEventTarget = new EventTarget()

export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
  LocalStorageEventTarget.dispatchEvent(new Event('clearLS'))
}
export const getAccessTokenFromLS = () => {
  return localStorage.getItem('access_token') || ''
}

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileFromLS = (profile: User) => {
  JSON.stringify(localStorage.setItem('profile', JSON.stringify(profile)))
}
