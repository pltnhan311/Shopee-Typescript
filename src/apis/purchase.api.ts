import Http from '../utils/http'
import { Purchase, PurchaseListStatus } from '../types/purchase.type'
import { SuccessResponse } from '../types/utils.type'

const URL = 'purchases'

export const addToCart = (body: { product_id: string; buy_count: number }) => {
  return Http.post<SuccessResponse<Purchase>>(`${URL}/add-to-cart`, body)
}

export const getPurchases = async (params: { status: PurchaseListStatus }) => {
  return await Http.get<SuccessResponse<Purchase[]>>(URL, {
    params
  })
}

export const buyProducts = async (body: { product_id: string; buy_count: number }[]) => {
  await Http.post<SuccessResponse<Purchase[]>>(`${URL}/buy-products`, body)
}

export const updatePurchase = async (body: { product_id: string; buy_count: number }) => {
  await Http.put<SuccessResponse<Purchase>>(`${URL}/update-purchase`, body)
}

export const deletePurchase = async (purchaseIds: string[]) => {
  await Http.delete<SuccessResponse<{ deleted_count: number }>>(`${URL}`, {
    data: purchaseIds
  })
}
