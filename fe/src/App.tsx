import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./pages/login";
import Body from "./pages/body";
import HomePage from "./pages/homepage";
import RegisterPage from "./pages/register";
import { useEffect } from "react";
import { getAccount } from "./services/apiService";
import { useAppDispatch, useAppSelector } from "./redux/hook";
import { doLogin, setLoading } from "./redux/user/userSlice";
import ErrorPage from "./pages/404";
import Loading from "./components/Loading";
import Layout from "./pages/layout/user";
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutAdmin from "./pages/layout/admin";
import Dashboard from "./pages/admin/dashboard";
import ManageUser from "./pages/admin/user";
import ManageBook from "./pages/admin/book";
import ManageOrder from "./pages/admin/order";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/test",
        element: <Body />
      }
    ]
  },
  {
    path: "/admin",
    element: <ProtectedRoute><LayoutAdmin /></ProtectedRoute>,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "user",
        element: <ManageUser />
      },
      {
        path: "user/manage",
        element: <ManageUser />
      },
      {
        path: "book",
        element: <ManageBook />
      },
      {
        path: "order",
        element: <ManageOrder />
      }

    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  }
]);
function App() {
  const isPublicPath = window.location.pathname === "/login" || window.location.pathname === "/register"
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.account.isLoading)
  const handleGetAccount = async () => {
    const res = await getAccount()
    dispatch(setLoading())
    if (res && res.data) {
      dispatch(doLogin(res.data))
    }
  }
  useEffect(() => {
    if (!isPublicPath)
      handleGetAccount()
  }, [])

  return (
    <>
      {!isLoading || isPublicPath || window.location.pathname === "/" ? <RouterProvider router={router} /> : <Loading />}

    </>
  )
}

export default App
