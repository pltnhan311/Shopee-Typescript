import { keepPreviousData, useQuery } from '@tanstack/react-query'
import AsideFilter from './AsideFilter'
import Product from './Product/Product'
import SortProductList from './SortProductList'
import { getProducts } from '../../apis/product.api'
import Pagination from '../../components/Pagination'
import { ProductListConfig } from '../../types/product.type'
import { getCategories } from '../../apis/category.api'
import useQueryConfig from '../../hooks/useQueryConfig'

export default function ProductList() {
  const queryConfig = useQueryConfig()

  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig], // giong useEffect dependencies
    queryFn: () => getProducts(queryConfig as ProductListConfig),
    placeholderData: keepPreviousData,
    staleTime: 3 * 60 * 1000 // 3 minutes: fetch data again
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
