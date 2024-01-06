import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { useAppSelector } from '../../../redux/hook';
const items: MenuProps['items'] = [

    {
        label: "Thông tin tài khoản",
        key: '1',
    },
    {
        type: 'divider',
    },
    {
        label: 'Đăng xuất',
        key: '3',
    },
];
const AdminDropdown = () => {
    const name = useAppSelector(state => state.account.user.name)
    return <> <Dropdown menu={{ items }} trigger={['click']}>
        <a onClick={(e) => e.preventDefault()}>
            <Space>
                Hi, {name}
                <DownOutlined />
            </Space>
        </a>
    </Dropdown>
    </>
}
export default AdminDropdown