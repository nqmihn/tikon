import { Modal, Form, Input, message } from 'antd';
import { IUserDetail } from '../../../utils/type/user';
import { useEffect } from 'react';
import { putUpdateUser } from '../../../services/apiService';
import { IAxiosResponse } from '../../../utils/type/axiosResponse';
type UpdateUserProps = {
    isOpen: boolean;
    setClose: () => void;
    userData?: IUserDetail
}
type FieldType = {
    _id: string;
    email: string;
    name: string;
    phoneNumber: string;
    address?: string
};
const UpdateUser = (props: UpdateUserProps) => {
    const { isOpen, setClose, userData } = props
    const [form] = Form.useForm()
    const handleOk = () => {
        form.submit()
    };

    const handleCancel = () => {
        setClose()
        form.setFieldValue("address", "")
    };
    const onFinish = async (values: FieldType) => {
        const res: IAxiosResponse = await putUpdateUser(values)
        if (res.data) {
            message.success("Update User Succeed !")
        } else if (res.message) {
            message.error(res.message ?? "Something wrong happen!")
        }
        handleCancel()
    };
    useEffect(() => {
        form.setFieldsValue(userData)
    }, [userData])

    return <>
        <Modal title="Basic Modal" open={isOpen} onOk={handleOk} onCancel={handleCancel} width={1000} okButtonProps={{
            className: "bg-primary"
        }}>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 800 }}
                onFinish={onFinish}
                autoComplete="off"
                form={form}
            >
                <Form.Item<FieldType>
                    label="Id"
                    name="_id"
                    hidden
                >
                    <Input hidden />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your Email!' }]}
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Phone"
                    name="phoneNumber"
                    rules={[{ required: true, message: 'Please input your phone!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Address"
                    name="address"
                >
                    <Input />
                </Form.Item>

            </Form>
        </Modal>
    </>
}
export default UpdateUser