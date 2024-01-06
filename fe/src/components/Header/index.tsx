import { CiSearch } from "react-icons/ci";
import { FaHome, FaShoppingCart } from "react-icons/fa";
import { RiAccountCircleFill } from "react-icons/ri";
import { Avatar, Badge, Space } from 'antd';
import "./index.css"
import UserAvatar from "../Avatar";
import { useAppSelector } from "../../redux/hook";
import { useNavigate } from "react-router-dom";
const Header = () => {
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated)
    const navigate = useNavigate()
    const checkLogin = () => {
        if (!isAuthenticated) {
            navigate('/login')
        }
    }
    return <>
        <header className="relative bg-white">
            <div className="w-full">
                <div className="flex gap-12 mx-auto px-12">
                    <img src="/logo.png" alt="logo" className="w-[80px] h-[80px] cursor-pointer" onClick={() => navigate('/')} />
                    <div className="flex items-center justify-center">
                        <div className="flex h-11 border rounded-md items-center gap-1 shadow">
                            <CiSearch className="text-xl ml-2" />
                            <input type="text" placeholder="Tìm kiếm" className="w-[800px] focus-visible:outline-none px-2" />
                            <button className="search-btn relative flex items-center justify-center px-2 py-2 h-full rounded-r-md">Tìm kiếm</button>
                        </div>
                    </div>
                    <div className="flex gap-4 ml-4 items-center">
                        <button className="flex items-center justify-center gap-2 rounded homepage h-10 px-3 py-2"><FaHome className="text-2xl icon-color" />Trang chủ</button>
                        <button className="flex items-center justify-center gap-2 rounded account h-10 px-2 py-2" onClick={checkLogin}>
                            {isAuthenticated ? <UserAvatar /> : <><RiAccountCircleFill className="text-2xl" />Tài khoản</>}


                        </button>
                        <button className="flex items-center justify-center gap-2 rounded h-10 btn-cart px-2 py-2 relative ml-2">
                            <Space size={"middle"}>
                                <Badge count={100} overflowCount={99} size="small">
                                    <FaShoppingCart className="text-2xl icon-color" />
                                </Badge>

                            </Space>
                        </button>
                    </div>
                </div>
            </div>
        </header >
    </>
}

export default Header