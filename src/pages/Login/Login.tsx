import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { getRules } from '../../components/utils/rules'
interface FormData {
  email: string
  password: string
  confirm_password: string
}
export default function Login() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<FormData>()

  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })

  const rules = getRules(getValues)

  return (
    <div className='bg-rose-200'>
      <div className='container mx-auto max-w-7xl px-4'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit}>
              <div className='text-2xl'>Đăng nhập</div>
              <div className='mt-8'>
                <input
                  type='email'
                  className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
                  placeholder='Email'
                  {...register('email', rules.email)}
                />
                <div className='mt-1 min-h-[1rem] text-sm text-rose-600'>{errors?.email?.message}</div>
              </div>
              <div className='mt-3'>
                <input
                  type='password'
                  className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
                  placeholder='Password'
                  autoComplete='on'
                  {...register('password', rules.password)}
                />
                <div className='mt-1 min-h-[1rem] text-sm text-rose-600'>{errors?.password?.message}</div>
              </div>
              <div className='mt-3'>
                <button
                  className='w-full bg-rose-500 px-2 py-4 text-center text-sm uppercase text-white hover:bg-rose-600'
                  type='submit'
                >
                  Đăng nhập
                </button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn chưa có tài khoản?</span>
                <Link className='ml-1 text-rose-400' to='/register'>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
