import NotPermittedPage from "../../pages/403"
import { useAppSelector } from "../../redux/hook"

type PropsWithChildren = {
    children: React.ReactNode
}
const ProtectedRoute = (props: PropsWithChildren) => {
    const role = useAppSelector(state => state.account.user.role)
    return <>

        {role === "ADMIN" && window.location.pathname.startsWith('/admin') ? props.children : <NotPermittedPage />}

    </>
}

export default ProtectedRoute