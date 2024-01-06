import React, { useState } from 'react';
import {
    FileOutlined,
    BarChartOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Footer from '../../../components/Footer';
import { FaBook } from "react-icons/fa";
import { Outlet, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AdminDropdown from '../../../components/Admin/Dropdown';
const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate()
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [title, setTitle] = useState("Dashboard")
    const items: MenuItem[] = [
        getItem(<Link to='/admin'>Dashboard</Link>, 'dashboard', <BarChartOutlined />),
        getItem(<Link to='/admin/book' onClick={() => setTitle('Book')}>Book</Link>, 'book', <FaBook />),
        getItem(<Link to='/admin/user' onClick={() => setTitle('User')} >User</Link>, 'user', <UserOutlined />, [
            getItem(<Link to='/admin/user/manage' onClick={() => setTitle('User')} >Manage User</Link>, '3'),
            getItem('Bill', '4'),
            getItem('Alex', '5'),
        ]),
        getItem(<Link to='/admin/order' onClick={() => setTitle('Order')}>Order</Link>, 'order', <FileOutlined />),
    ];
    return <>
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer, height: '80px' }} >
                    <div className='flex justify-between items-center'>
                        <div>
                            <img src="/logo.png" alt="logo" className="w-[80px] h-full  cursor-pointer" onClick={() => navigate('/')} />
                        </div>
                        <div className='float-right px-10'>
                            <AdminDropdown />
                        </div>
                    </div>
                </Header>
                <Content style={{ margin: '16px 16px', }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Admin</Breadcrumb.Item>
                        <Breadcrumb.Item>{title}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer />
            </Layout>
        </Layout>
    </>
}

export default LayoutAdmin