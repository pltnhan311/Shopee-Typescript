import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, Schema } from '../../utils/rules'
import { useMutation } from '@tanstack/react-query'
import { registerAccount } from '../../apis/auth.api'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import { ErrorResponse } from '../../types/utils.type'
import { useContext } from 'react'
import { AppContext } from '../../contexts/app.context'
import Button from '../../components/Button'
import path from '../../constants/path'

// interface FormData {
//   email: string
//   password: string
//   confirm_password: string
// }

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
const registerSchema = schema.pick(['email', 'password', 'confirm_password'])

export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError?.email) {
            setError('email', {
              message: formError.email,
              type: 'Server'
            })
          }
          if (formError?.password) {
            setError('password', {
              message: formError.password,
              type: 'Server'
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-rose-200'>
      <div className='container mx-auto max-w-7xl px-4'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng ký</div>
              <Input
                type='email'
                name='email'
                register={register}
                className='mt-8'
                errorMessage={errors.email?.message}
                placeholder='Email'
              />
              <Input
                type='password'
                name='password'
                register={register}
                className='mt-3'
                errorMessage={errors.password?.message}
                placeholder='Password'
                autoComplete='on'
              />
              <Input
                type='password'
                name='confirm_password'
                register={register}
                className='mt-3'
                errorMessage={errors.confirm_password?.message}
                placeholder='Confirm Password'
                autoComplete='on'
              />
              <Button
                isLoading={registerAccountMutation.isPending}
                disabled={registerAccountMutation.isPending}
                className='w-full bg-rose-500 px-2 py-4 text-center text-sm uppercase text-white hover:bg-rose-600 rounded-md flex justify-center items-center'
                type='submit'
              >
                Đăng ký
              </Button>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn đã có tài khoản?</span>
                <Link className='ml-1 text-rose-400' to={path.login}>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
