import { createBrowserRouter, Outlet } from 'react-router-dom'
import '@/index.css'
import Root from '@/routes/root'
import ErrorPage from '@/error'
import { Home } from './routes/home'
import Courses from './routes/courses'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: '/',
            element: <Home />,
            errorElement: <ErrorPage />,
          },
          {
            path: '/:providerId/courses',
            element: <Courses />,
            errorElement: <ErrorPage />,
          }
        ],
      },
    ],
  },
])
