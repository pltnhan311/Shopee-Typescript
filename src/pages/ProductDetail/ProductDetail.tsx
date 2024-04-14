import { useQuery } from '@tanstack/react-query'
import { getProductDetail } from '../../components/apis/product.api'
import { useParams } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import ProductRating from '../../components/ProductRating'
import { formatCurrency, formatNumberToSocialStyle, rateSale } from '../../components/utils/utils'
import InputNumber from '../../components/InputNumber'
import { useEffect, useMemo, useState } from 'react'
import { Product } from '../../components/types/product.type'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: productDetailData } = useQuery({
    queryKey: ['products', id],
    queryFn: () => getProductDetail(id as string)
  })
  const product = productDetailData?.data.data
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')

  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )

  useEffect(() => {
    if (product && product.image.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  const next = () => {
    console.log(currentIndexImages[1])
    if (currentIndexImages[1] < (product as Product).images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const chooseActive = (img: string) => {
    setActiveImage(img)
  }

  if (!product) return null
  return (
    <div className='bg-gray-200 py-6'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div className='relative w-full pt-[100%] shadow'>
                <img
                  src={activeImage}
                  alt={product.name}
                  className='absolute left-0 top-0 h-full w-full object-cover bg-white'
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={prev}
                >
                  <FaChevronLeft />
                </button>
                {currentImages.map((img) => {
                  const isActive = img === activeImage
                  return (
                    <div className='relative w-full pt-[100%]' key={img} onMouseEnter={() => chooseActive(img)}>
                      <img
                        src={img}
                        alt={product.name}
                        className='absolute left-0 top-0 h-full w-full object-cover bg-white cursor-pointer'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-rose-400 rounded-sm'></div>}
                    </div>
                  )
                })}
                <button
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={next}
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-8 flex items-center'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-rose-500 text-rose-600'>{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    activeClassname='h-4 w-4 text-rose-600 fill-darkpink'
                    nonActiveClassname='h-4 w-4 text-gray-300 fill-gray-300'
                  />
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <div className='flex items-center'>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className='ml-1 text-gray-500'>Đã bán</span>
                </div>
              </div>
              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>₫{formatCurrency(product.price_before_discount)}</div>
                <div className='ml-3 text-3xl font-medium text-rose-500'>₫{formatCurrency(product.price)}</div>
                <div className='ml-4 rounded-sm bg-rose-500 px-1 py-[2px] text-xs text-white font-semibold uppercase'>
                  {rateSale(product.price_before_discount, product.price)}Giảm
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>Số lượng</div>
                <div className='ml-10 flex items-center'>
                  <button className='flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='h-4 w-4'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
                    </svg>
                  </button>
                  <InputNumber
                    value={1}
                    className=''
                    classNameError='hidden'
                    classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
                  />
                  <button className='flex h-8 w-8 items-center justify-center rounded-r-sm border border-gray-300 text-gray-600'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='h-4 w-4'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                    </svg>
                  </button>
                </div>
                <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
              </div>
              <div className='mt-8 flex items-center'>
                <button className='flex h-12 items-center justify-center rounded-sm border border-rose-500 bg-rose-500/10 px-5 capitalize text-rose-500 shadow-sm hover:bg-rose-500/5'>
                  <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x={0}
                    y={0}
                    className='mr-[10px] h-5 w-5 fill-current stroke-rose-500 text-rose-500'
                  >
                    <g>
                      <g>
                        <polyline
                          fill='none'
                          points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeMiterlimit={10}
                        />
                        <circle cx={6} cy='13.5' r={1} stroke='none' />
                        <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                      </g>
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1='7.5' x2='10.5' y1={7} y2={7} />
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1={9} x2={9} y1='8.5' y2='5.5' />
                    </g>
                  </svg>
                  Thêm vào giỏ hàng
                </button>
                <button className='fkex ml-4 h-12 min-w-[5rem] items-center justify-center rounded-sm bg-rose-500 px-5 capitalize text-white shadow-sm outline-none hover:bg-rose-500/90'>
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='container mx-auto max-w-7xl px-4'>
        <div className='mt-8 bg-white p-4 shadow'>
          <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>Mô tả sản phẩm</div>
          <div className='mx-4 mb-4 mt-12 text-sm leading-loose'>
            <div
            // dangerouslySetInnerHTML={{
            //   __html: DOMPurify.sanitize(product.description)
            // }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
