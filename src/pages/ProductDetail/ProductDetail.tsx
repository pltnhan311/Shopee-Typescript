import { useQuery } from '@tanstack/react-query'
import { getProductDetail } from '../../components/apis/product.api'
import { useParams } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: productDetailData } = useQuery({
    queryKey: ['products', id],
    queryFn: () => getProductDetail(id as string)
  })
  const product = productDetailData?.data.data
  console.log(product)
  if (!product) return null
  return (
    <div className='bg-gray-200 py-6'>
      <div className='bg-white p-4 shadow'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div className='relative w-full pt-[100%] shadow'>
                <img
                  src={product.image}
                  alt={product.name}
                  className='absolute left-0 top-0 h-full w-full object-cover bg-white'
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20'>
                  <FaChevronLeft />
                </button>
                {product.images.slice(0, 5).map((img, index) => {
                  const isActive = index === 0
                  return (
                    <div className='relative w-full pt-[100%] shadow' key={img}>
                      <img
                        src={img}
                        alt={product.name}
                        className='absolute left-0 top-0 h-full w-full object-cover bg-white cursor-pointer'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-rose-400 rounded-sm'></div>}
                    </div>
                  )
                })}
                <button className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20'>
                  <FaChevronRight />
                </button>
              </div>
            </div>
            <div className='col-span-7'></div>
          </div>
        </div>
      </div>
    </div>
  )
}
