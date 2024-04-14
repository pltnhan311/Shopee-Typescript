import { Category } from '../types/category.type'
import { SuccessResponse } from '../types/utils.type'
import Http from '../utils/http'

export const getCategories = async () => {
  return await Http.get<SuccessResponse<Category[]>>('/categories')
}
