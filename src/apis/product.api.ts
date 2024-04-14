import { Product, ProductList, ProductListConfig } from '../types/product.type'
import { SuccessResponse } from '../types/utils.type'
import Http from '../utils/http'

export const getProducts = async (params: ProductListConfig) => {
  return await Http.get<SuccessResponse<ProductList>>('/products', { params })
}

export const getProductDetail = async (id: string) => {
  return await Http.get<SuccessResponse<Product>>(`/products/${id}`)
}
