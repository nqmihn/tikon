import { useNavigate } from "react-router-dom"

const NotPermittedPage = () => {
    const navigate = useNavigate()
    return <>
        <div className="flex flex-col justify-center items-center gap-5 mt-2">
            <h1 className="text-3xl">403 Not Permitted !!!</h1>
            <img src="/404.jpg" alt="error" className="w-20 h-20" />
            <h3 className="text-xl">You don't have permission to access this page</h3>
            <button className="bg-blue-500 border rounded-[4px] text-white px-3 py-2 hover:bg-blue-600" onClick={() => navigate('/')}>Back to Homepage</button>
        </div>
    </>
}
export default NotPermittedPage