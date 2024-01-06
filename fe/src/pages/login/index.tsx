import { Button, Divider, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { postLogin } from '../../services/apiService';
import { useAppDispatch } from '../../redux/hook';
import { doLogin } from '../../redux/user/userSlice';
type FieldType = {
    email: string;
    password: string;
}
type LoginResponse = {
    statusCode?: number;
    data?: any
    message?: string
    error?: string
}

const LoginPage = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    const onFinish = async (values: FieldType) => {
        setLoading(true)
        const { email, password } = values
        const res: LoginResponse = await postLogin(email, password);
        setLoading(false)
        if (res?.data?.user) {
            console.log(res)
            localStorage.setItem("access_token", res.data.accessToken)
            message.success("Đăng nhập thành công")
            dispatch(doLogin(res.data.user))
            navigate('/')

        } else {
            messageApi.open({
                type: 'error',
                content: res?.message,
            });
        }

    };

    return <>
        {contextHolder}
        <div className='w-full h-full flex justify-center items-center flex-col rounded'>
            <div className='mx-auto bg-white py-10 border rounded shadow-md w-[700px]'>
                <h2 className='text-center text-4xl cursor-pointer' onClick={() => navigate('/')}>Tiki Clone</h2>
                <h3 className='text-center text-xl mt-2'>Login Page</h3>
                <Divider />
                <Form
                    name="basic"
                    style={{ maxWidth: 600, margin: '0 auto' }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
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
                    <div className='cursor-pointer text-base my-2 hover:underline'>Quên mật khẩu?</div>
                    <div className='text-center'>
                        <Form.Item>
                            <Button htmlType="submit" className='bg-blue-500 hover:bg-blue-400 w-full mt-3 py-5 flex items-center justify-center' loading={loading}>
                                <div className='text-white'>Đăng nhập</div>
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
                <div className='text-center'> Chưa có tài khoản <span className='cursor-pointer font-bold hover:underline' onClick={() => navigate('/register')}>Đăng Ký</span></div>

                <Divider>
                    <div className='text-gray-400'>Hoặc đăng nhập với</div>
                </Divider>
                <div className='flex items-center justify-center gap-5'>
                    <img src="https://salt.tikicdn.com/ts/upload/3a/22/45/0f04dc6e4ed55fa62dcb305fd337db6c.png" alt="facebook" className='w-14 cursor-pointer hover:border hover:rounded-full' />
                    <img src="https://salt.tikicdn.com/ts/upload/1c/ac/e8/141c68302262747f5988df2aae7eb161.png" alt="google" className='cursor-pointer hover:border hover:rounded-full w-14' />
                </div>
            </div>
        </div >
    </>
}
export default LoginPage