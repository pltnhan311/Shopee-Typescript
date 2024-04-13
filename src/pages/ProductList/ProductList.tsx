import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { omitBy, isUndefined } from 'lodash'
import AsideFilter from './AsideFilter'
import Product from './Product/Product'
import SortProductList from './SortProductList'
import useQueryParam from '../../hooks/useQueryParam'
import { getProducts } from '../../components/apis/product.api'
import Pagination from '../../components/Pagination'
import { ProductListConfig } from '../../components/types/product.type'
import { getCategories } from '../../components/apis/category.api'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductList() {
  const queryParams: QueryConfig = useQueryParam()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '20',
      sort_by: queryParams.sort_by,
      exclude: queryParams.exclude,
      name: queryParams.name,
      order: queryParams.order,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter,
      category: queryParams.category
    },
    isUndefined
  )

  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig], // giong useEffect dependencies
    queryFn: () => getProducts(queryConfig as ProductListConfig),
    placeholderData: keepPreviousData
  })

  const { data: categoryData } = useQuery({
    queryKey: ['categories'], // giong useEffect dependencies
    queryFn: () => getCategories()
  })

  console.log(categoryData)

  return (
    <div className='bg-gray-200 bg-gradient-to-r from-blue-300 to-rose-300 py-6'>
      <div className='max-w-7xl mx-auto px-4'>
        {productData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter queryConfig={queryConfig} categories={categoryData?.data.data || []} />
            </div>
            <div className='col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productData.data.data.products.map((p) => (
                  <div className='col-span-1' key={p._id}>
                    <Product product={p} />
                  </div>
                ))}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
