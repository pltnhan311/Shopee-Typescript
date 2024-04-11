import useRouteElement from './hooks/useRouteElement'

export default function App() {
  const routeElements = useRouteElement()
  return <div>{routeElements}</div>
}
