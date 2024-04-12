import { Toaster } from 'react-hot-toast'
import useRouteElement from './hooks/useRouteElement'

export default function App() {
  const routeElements = useRouteElement()
  return (
    <div>
      {routeElements}
      <Toaster />
    </div>
  )
}
