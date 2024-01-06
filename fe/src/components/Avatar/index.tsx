import type { MenuProps } from 'antd';
import { Avatar, Space, message, Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { postLogout } from '../../services/apiService';
import { IAxiosResponse } from '../../utils/type/axiosResponse';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { doLogout } from '../../redux/user/userSlice';
import { Link, useNavigate } from 'react-router-dom';


const UserAvatar = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const handleLogout = async () => {
        const res: IAxiosResponse = await postLogout()
        if (res.data) {
            localStorage.removeItem("access_token")
            dispatch(doLogout())
            message.success("Đăng xuất thành công")
            navigate('/')

        }
    }
    const role = useAppSelector(state => state.account.user.role)
    let items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    Thông tin cá nhân
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    Đơn hàng
                </a>
            ),
        },
        {
            type: 'divider'
        },
        {
            key: '3',
            label: (
                <div onClick={handleLogout}>
                    Đăng xuất
                </div>
            ),
        },
    ];
    if (role === "ADMIN") {
        items.unshift({

            key: '0',
            label: (
                <Link to='/admin'>
                    Trang quản lý
                </Link>
            ),

        })
    }

    return <>
        <Dropdown menu={{ items }} placement='bottom'>
            <a onClick={(e) => e.preventDefault()}>
                <Space>
                    <Avatar icon={<UserOutlined />} size={'small'} />
                </Space>
            </a>
        </Dropdown>




    </>
}
export default UserAvatar