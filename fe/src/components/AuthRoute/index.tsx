import { Link } from "react-router-dom"
import { useAppSelector } from "../../redux/hook"
type PropsWithChildren = {
    children: React.ReactNode
}
const AuthRole = (props: PropsWithChildren) => {
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated)
    return <>
        {isAuthenticated ? props.children : <Link to='/' />}
    </>
}
export default AuthRole