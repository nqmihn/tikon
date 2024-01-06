import { Drawer, Badge, Descriptions } from 'antd';
import { IUserDetail } from '../../../utils/type/user';
import type { DescriptionsProps } from 'antd';
import moment from 'moment';
type UserDetailProps = {
    isOpen: boolean;
    setClose: () => void;
    userData: IUserDetail | undefined

}
const UserDetail = (props: UserDetailProps) => {
    const { isOpen, setClose, userData } = props
    const onClose = () => {
        setClose()
        console.log(userData)

    }
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Name',
            children: userData?.name,
        },
        {
            key: '2',
            label: 'Email',
            children: userData?.email,
        },
        {
            key: '3',
            label: 'Phone Number',
            children: userData?.phoneNumber,
        },
        {
            key: '4',
            label: 'Address',
            span: 3,
            children: userData?.address ? userData.address : <div className='text-gray-400'>Address hasn't been updated</div>,
        },
        {
            key: '5',
            label: 'Role',
            children: <Badge status="processing" text={userData?.role} />,
        },
        {
            key: '6',
            label: 'Account creation date',
            span: 2,
            children: userData?.createdAt ? moment(userData.createdAt).format("DD-MM-YYYY HH:mm:ss") : "",
        },


    ];
    return <>
        <Drawer title="User Information" placement="right" onClose={onClose} open={isOpen} width={"50vw"}>
            <Descriptions title={`#${userData?._id}`} layout="vertical" bordered items={items} />
        </Drawer>
    </>
}

export default UserDetail