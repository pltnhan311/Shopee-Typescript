import { useMutation, useQuery } from '@tanstack/react-query'
import { getProductDetail, getProducts } from '../../apis/product.api'
import { useNavigate, useParams } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import ProductRating from '../../components/ProductRating'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from '../../utils/utils'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Product as ProductType, ProductListConfig } from '../../types/product.type'
import Product from '../ProductList/Product'
import QuantityController from '../../components/QuantityController/QuantityController'
import { addToCart } from '../../apis/purchase.api'
import toast from 'react-hot-toast'
import { queryClient } from '../../main'
import { purchasesStatus } from '../../constants/purchase'
import path from '../../constants/path'

export default function ProductDetail() {
  const navigate = useNavigate()
  const [buyCount, setBuyCount] = useState(1)

  // const { id } = useParams<{ id: string }>()
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)

  const { data: productDetailData } = useQuery({
    queryKey: ['products', id],
    queryFn: () => getProductDetail(id as string)
  })
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')
  const product = productDetailData?.data.data

  const imageRef = useRef<HTMLImageElement>(null)

  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )

  const queryConfig: ProductListConfig = { limit: '20', page: '1', category: product?.category._id as string }
  const { data: relatedProductsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => getProducts(queryConfig),
    enabled: Boolean(product), // product co data, query moi dc goi
    staleTime: 3 * 60 * 1000
  })
  const relatedProducts = relatedProductsData?.data.data.products

  const addToCartMutation = useMutation({
    mutationFn: (body: { buy_count: number; product_id: string }) => {
      return addToCart(body)
    }
  })

  useEffect(() => {
    if (product && product.image.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  const next = () => {
    console.log(currentIndexImages[1])
    if (currentIndexImages[1] < (product as ProductType).images.length) {
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

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image
    // Cách 1: Lấy offsetX, offsetY đơn giản khi chúng ta đã xử lý được bubble event
    // const { offsetX, offsetY } = event.nativeEvent

    // Cách 2: Lấy offsetX, offsetY khi chúng ta không xử lý được bubble event
    const offsetX = event.pageX - (rect.x + window.scrollX)
    const offsetY = event.pageY - (rect.y + window.scrollY)

    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)

    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const onAddToCart = () => {
    addToCartMutation.mutate(
      {
        product_id: product?._id as string,
        buy_count: buyCount
      },
      {
        onSuccess: (data) => {
          toast.success(data.data.message, {
            position: 'top-center'
          })
          queryClient.invalidateQueries({
            queryKey: [
              'purchases',
              {
                status: purchasesStatus.inCart
              }
            ]
          })
        }
      }
    )
  }

  const onBuyNow = async () => {
    const res = await addToCartMutation.mutateAsync({
      product_id: product?._id as string,
      buy_count: buyCount
    })
    const purchase = res.data.data
    navigate(path.cart, {
      state: {
        purchaseId: purchase._id
      }
    })
  }

  if (!product) return null
  return (
    <div className='bg-gray-200 py-6'>
      <div className='mt-8'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='bg-white p-4 shadow'>
            <div className='grid grid-cols-12 gap-9'>
              <div className='col-span-5'>
                <div
                  className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
                  onMouseMove={handleZoom}
                  onMouseLeave={handleRemoveZoom}
                >
                  <img
                    src={activeImage}
                    alt={product.name}
                    className=' absolute left-0 top-0 h-full w-full bg-white object-cover'
                    ref={imageRef}
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
                  {/* Quantity Component */}
                  <QuantityController
                    onDecrease={handleBuyCount}
                    onIncrease={handleBuyCount}
                    onType={handleBuyCount}
                    value={buyCount}
                    max={product.quantity}
                  />
                  <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
                </div>
                <div className='mt-8 flex items-center'>
                  <button
                    className='flex h-12 items-center justify-center rounded-sm border border-rose-500 bg-rose-500/10 px-5 capitalize text-rose-500 shadow-sm hover:bg-rose-500/5'
                    onClick={onAddToCart}
                  >
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
                        <line
                          fill='none'
                          strokeLinecap='round'
                          strokeMiterlimit={10}
                          x1='7.5'
                          x2='10.5'
                          y1={7}
                          y2={7}
                        />
                        <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1={9} x2={9} y1='8.5' y2='5.5' />
                      </g>
                    </svg>
                    Thêm vào giỏ hàng
                  </button>
                  <button
                    className='fkex ml-4 h-12 min-w-[5rem] items-center justify-center rounded-sm bg-rose-500 px-5 capitalize text-white shadow-sm outline-none hover:bg-rose-500/90'
                    onClick={onBuyNow}
                  >
                    Mua ngay
                  </button>
                </div>
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
              dangerouslySetInnerHTML={{
                __html: product.description
              }}
            />
          </div>
        </div>
      </div>
      <div className='mt-8'>
        <div className='max-w-7xl px-4 mx-auto'>
          <div className='text-xl uppercase text-gray-500'>Có thể bạn cũng thích</div>
          <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {relatedProducts?.map((p) => (
              <div className='col-span-1' key={p._id}>
                <Product product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
