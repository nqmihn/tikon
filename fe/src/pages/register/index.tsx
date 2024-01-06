import { Button, Divider, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { postRegister } from '../../services/apiService';
import { useState } from 'react';
type FieldType = {
    email: string;
    name: string;
    password: string;
    address: string;
    phoneNumber: string
}
type RegisterResponse = {
    statusCode?: number;
    data?: any
    message?: string
    error?: string
}

const RegisterPage = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    const onFinish = async (values: FieldType) => {
        setLoading(true)
        const { email, name, password, address, phoneNumber } = values
        const res: RegisterResponse = await postRegister(email, name, password, address, phoneNumber)
        if (res?.data?._id) {
            messageApi.open({
                type: 'success',
                content: 'Register Succeed!',
            });
            navigate('/login')
        } else {
            messageApi.open({
                type: 'error',
                content: res?.message,
            });
        }

        setLoading(false)

    };

    return <>
        {contextHolder}
        <div className='w-full h-full flex justify-center items-center flex-col rounded'>
            <div className='mx-auto bg-white py-10 border rounded shadow-md w-[700px]'>
                <h2 className='text-center text-4xl cursor-pointer' onClick={() => navigate('/')}>Tiki Clone</h2>
                <h3 className='text-center text-xl mt-2'>Register Page</h3>
                <Divider />
                <Form
                    name="basic"
                    style={{ maxWidth: 600, margin: '0 auto' }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Họ tên"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập Email!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập Địa chỉ!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Số điện thoại"
                        name="phoneNumber"
                        rules={[{ required: true, message: 'Vui lòng nhập Số điện thoại!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <div className='text-center'>
                        <Form.Item>
                            <Button htmlType="submit" className='bg-blue-500 hover:bg-blue-400 w-full mt-3 py-5 flex items-center justify-center' loading={loading}>
                                <div className='text-white'>Đăng Ký</div>
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
                <div className='text-center'> Đã có tài khoản? <span className='cursor-pointer font-bold hover:underline' onClick={() => navigate('/login')}>Đăng nhập ngay</span></div>

            </div>
        </div>
    </>
}
export default RegisterPage