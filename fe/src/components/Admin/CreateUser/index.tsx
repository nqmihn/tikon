
import { Form, Input, Modal, Select, message, notification } from 'antd';
import { postCreateUser } from '../../../services/apiService';
import { IAxiosResponse } from '../../../utils/type/axiosResponse';
import { useState } from 'react';
type CreateUserProps = {
    isShow: boolean
    onCancel: () => void;
    fetchListUser: () => void;
}
type CreateUserData = {
    email: string, password: string, name: string, phoneNumber: string, role: string
}
const { Option } = Select;
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const CreateUserModal = (props: CreateUserProps) => {
    const { isShow, onCancel, fetchListUser } = props
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const onFinish = async (values: CreateUserData) => {
        setLoading(true)
        const { email, password, name, phoneNumber, role } = values
        const res: IAxiosResponse = await postCreateUser(email, password, name, phoneNumber, role)
        setLoading(false)
        if (res.data) {
            message.success("Add User Succeed!")
            form.resetFields();
            onCancel()
            fetchListUser()
        }
        if (!res.data && res.message) {
            console.log(typeof res.message)
            notification.error({
                message: "Your data is invalid",
                description: typeof res.message === "string" ? res.message : res.message[0]
            })
        }
    };


    const handleOk = () => {
        form.submit()
    }
    const handleCancel = () => {
        onCancel()
        form.resetFields()
    }
    return <>
        <Modal title="Basic Modal" open={isShow} onOk={handleOk} onCancel={handleCancel} okButtonProps={{
            className: "bg-primary"
        }}
            width={1000}
            confirmLoading={loading}
        >
            <Form
                {...layout}
                form={form}
                name="control-hooks"
                onFinish={onFinish}
                style={{ maxWidth: 800 }}
            >
                <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please fill email" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please fill name" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please fill password" }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                    <Select
                        placeholder="Select Role"
                    >
                        <Option value="USER">User</Option>
                        <Option value="ADMIN">Admin</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
                >
                    {({ getFieldValue }) =>
                        getFieldValue('gender') === 'other' ? (
                            <Form.Item name="customizeGender" label="Customize Gender" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        ) : null
                    }
                </Form.Item>
            </Form>
        </Modal></>
}
export default CreateUserModal