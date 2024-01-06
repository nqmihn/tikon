import { Modal, message, Upload, Table, notification } from 'antd';
import type { UploadProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { InboxOutlined } from '@ant-design/icons';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { useState } from 'react';
import * as XLSX from "xlsx"
import _ from "lodash"
import { postCreateManyUser } from '../../../services/apiService';
import { IPostCreateManyUser } from '../../../utils/type/user';
import { IAxiosResponse } from '../../../utils/type/axiosResponse';
import Loading from '../../Loading';
import SampleFile from "./user.xlsx?url"
type ImportUserProps = {
    isOpen: boolean;
    setClose: () => void;
    fetchListUser: () => void;
}

interface DataType {
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
    password?: string;
}


const columns: ColumnsType<DataType> = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
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
    }

];
const { Dragger } = Upload;

const ImportUser = (props: ImportUserProps) => {
    const { isOpen, setClose, fetchListUser } = props
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<DataType[]>([])
    const handleOk = async () => {
        setLoading(true)
        const listUserClone = _.cloneDeep(data)
        const listUser: IPostCreateManyUser[] = listUserClone.map(user => {
            return {
                name: user.name,
                email: user.email,
                password: import.meta.env.VITE_USER_DEFAULT_PASSWORD,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        })
        const res: IAxiosResponse = await postCreateManyUser(listUser)
        setLoading(false)
        if (res && res.data) {
            message.success("Import User Succeed!")
            fetchListUser()
            handleCancel()
        } else if (res && res.error) {
            notification.error({
                message: "Something wrong!",
                description: res.message
            })
        }
    }
    const handleCancel = () => {
        setClose()
        setData([])
    }
    const ImportRequest = (options: RcCustomRequestOptions) => {
        setData([])
        const { onSuccess } = options
        setTimeout(() => { onSuccess?.("ok") }, 1000)


    }
    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        maxCount: 1,
        customRequest: ImportRequest,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                const file = info.fileList[0].originFileObj
                let reader = new FileReader()
                reader.onload = function (e) {
                    if (e.target) {
                        let data = new Uint8Array(e.target.result as ArrayBuffer);
                        let workbook = XLSX.read(data, { type: 'array' });
                        // find the name of your sheet in the workbook first
                        let worksheet = workbook.Sheets['Sheet1'];

                        // convert to json format
                        const jsonData: DataType[] = XLSX.utils.sheet_to_json(worksheet, {
                            header: ["name", "email", "phoneNumber", "role"],
                            range: 1
                        });
                        console.log(jsonData)
                        if (jsonData.length > 0) {
                            setData(jsonData)
                        }



                    }
                };
                reader.readAsArrayBuffer(file as Blob);

                message.success(`${info.file.name} file uploaded successfully.`);

            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        onRemove() {
            setData([])
        },
    };
    return <>
        <Modal title="Import User" open={isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okButtonProps={{
                disabled: data.length === 0,
                className: "bg-primary"
            }}
            okText="Import"
            width={1000}>
            <Dragger {...propsUpload}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Only support for a single upload. File must be sheet or csv file . <a href={SampleFile} onClick={e => e.stopPropagation()}
                        className='text-primary hover:underline hover:text-primaryHover'>Download Sample File
                    </a>
                </p>
            </Dragger>
            <Table columns={columns} className='mt-10' dataSource={data} />
            {loading && <Loading />}
        </Modal>

    </>
}

export default ImportUser