import { useEffect, useState } from 'react';
import type { TableProps } from 'antd';
import { Space, Table, Select, Button, Dropdown } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import { getAllUser, getUserById } from '../../../services/apiService';
import Loading from '../../../components/Loading';
import { IAxiosResponse } from '../../../utils/type/axiosResponse';
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import UserDetail from '../../../components/Admin/UserDetail';
import { IUserDetail } from '../../../utils/type/user';
import { GoPlus } from "react-icons/go";
import CreateUserModal from '../../../components/Admin/CreateUser';
import { DownloadOutlined } from '@ant-design/icons';
import ImportUser from '../../../components/Admin/ImportUser';
import { CiExport } from "react-icons/ci";
import * as XLSX from "xlsx"
import type { MenuProps } from 'antd';

type IListUser = {
    _id: string;
    email: string;
    name: string;
    phoneNumber: string;
    role: string;
}

const ManageUser = () => {
    const [loading, setLoading] = useState(false)
    const [listUser, setListUser] = useState<IListUser[]>([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(1)
    const [queryEmail, setQueryEmail] = useState("")
    const [queryName, setQueryName] = useState("")
    const [sort, setSort] = useState(2)
    const [showUserDetail, setShowUserDetail] = useState(false)
    const [showCreateUser, setShowCreateUser] = useState(false)
    const [showImportUser, setShowImportUser] = useState(false)
    const [userData, setUserData] = useState<IUserDetail>()
    const columns: ColumnsType<IListUser> = [
        {
            title: 'Id',
            dataIndex: '_id',
            key: 'id',

        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',

        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'Name',

        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',

        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',

        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <div className='flex gap-3'>
                        <button onClick={() => handleClickShowDetail(record._id)}><FaEye className="text-xl hover:text-primary" /></button>
                        <button><MdDelete className="text-xl hover:text-red-600" /></button>
                    </div>

                </Space>
            ),
        },

    ];
    const items: MenuProps['items'] = [
        {
            label: <div onClick={() => exportTable("csv")}>Export to CSV</div>,
            key: '0',
        },
        {
            label: <div onClick={() => exportTable("xlsx")}>Export to XLSX</div>,
            key: '1',
        },
    ];
    const exportTable = (fileType: string) => {
        const worksheet = XLSX.utils.json_to_sheet(listUser);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
        XLSX.writeFile(workbook, `DataSheet.${fileType}`);
    }
    const HeaderTable = () => {
        return <>
            <div className='flex justify-between'>
                <div className='text-2xl font-bold'>List User</div>
                <div className='flex items-center gap-2'>
                    <Dropdown menu={{ items }} trigger={['click']}>
                        <Button type="primary" icon={<CiExport className="text-xl" />}
                            className='bg-primary border rounded text-white hover:bg-primaryHover'
                        />
                    </Dropdown>

                    <Button type="primary"
                        icon={<DownloadOutlined />}
                        className='bg-primary border rounded text-white hover:bg-primaryHover flex items-center gap-1'
                        onClick={() => setShowImportUser(true)}
                    >Import</Button>
                    <Button type='primary'
                        className='bg-primary border rounded text-white hover:bg-primaryHover flex items-center gap-1'
                        onClick={() => setShowCreateUser(true)}
                    >
                        <GoPlus className="text-white text-xl" />
                        Add User
                    </Button>
                </div>
            </div>
        </>
    }
    const handleClickShowDetail = async (_id: string) => {
        const res = await getUserById(_id)
        if (res.data) {
            setUserData(res.data)
        }
        setShowUserDetail(true)
    }
    const fetchListUser = async () => {
        setLoading(true)
        const query = `current=${current}&pageSize=${pageSize}&email=${queryEmail}&name=${queryName}&sort=${sort}`
        const res: IAxiosResponse = await getAllUser(query)
        setLoading(false)
        if (res.data) {
            setListUser(res.data.result)
            setTotal(res.data.totalItem)
        }

    }
    useEffect(() => {
        fetchListUser()
    }, [current, pageSize, sort])


    const handleChange: TableProps<IListUser>['onChange'] = (pagination, filters, sorter) => {
        if (pagination.current) {
            setCurrent(pagination.current)

        }
        if (pagination.pageSize && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
        }
        console.log(pagination, filters, sorter)

    };
    const handleClearSearch = () => {
        setQueryEmail("")
        setQueryName("")
    }
    const onSortChange = (value: number) => {
        setSort(value)
    }

    return <>
        <Space style={{ marginBottom: 16 }}>
        </Space>
        <div className='mb-4 flex flex-col gap-4 '>
            <div className="flex justify-between gap-10">
                <input type="text" placeholder='Search by name' className='border px-2 py-2 rounded w-full'
                    value={queryName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQueryName(e.target.value)}
                />
                <input type="text" placeholder='Search by email' className='border px-2 py-2 rounded w-full'
                    value={queryEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQueryEmail(e.target.value)}
                />
            </div>
            <div className='flex justify-between'>
                <Select
                    optionFilterProp="children"
                    onChange={onSortChange}
                    defaultValue={2}
                    options={[
                        {
                            value: 1,
                            label: 'Oldest',
                        },
                        {
                            value: 2,
                            label: 'Latest',
                        },

                    ]}
                />
                <div className='flex gap-3'>
                    <button className='border rounded px-4 py-2 bg-secondary hover:bg-secondaryHover text-white' onClick={handleClearSearch}>Clear</button>
                    <button className='border rounded px-4 py-2 bg-primary text-white hover:bg-primaryHover' onClick={fetchListUser}>Search</button>
                </div>
            </div>


        </div>
        {listUser.length > 0 && !loading ? <Table columns={columns} dataSource={listUser} onChange={handleChange}
            pagination={{
                pageSize,
                total,
                current,
                responsive: true,
                showSizeChanger: true
            }}
            title={HeaderTable}
        /> : <Loading />}
        <UserDetail isOpen={showUserDetail} setClose={() => setShowUserDetail(false)} userData={userData} />
        <CreateUserModal isShow={showCreateUser} onCancel={() => setShowCreateUser(false)} fetchListUser={fetchListUser} />
        <ImportUser isOpen={showImportUser} setClose={() => setShowImportUser(false)} fetchListUser={fetchListUser} />
    </>
}
export default ManageUser