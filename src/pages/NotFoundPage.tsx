import { Home, AlertCircle } from 'lucide-react';
import Footer from '../components/footer';
import Navbar from '../components/Navbar';

const NotFoundPage = () => {
    return (
        <>
            <Navbar />
            <div className="bg-orange-50 min-h-screen flex flex-col">
                <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden max-w-2xl mx-auto border border-orange-100 w-full">
                        <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-white">404</h1>
                            <p className="text-orange-300 mt-2">ไม่พบหน้าที่คุณต้องการ</p>
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="text-center py-8">
                                <div className="bg-orange-100 rounded-full p-4 mb-4 inline-flex">
                                    <AlertCircle className="h-12 w-12 text-orange-500" />
                                </div>
                                <p className="text-lg text-gray-600 mb-2">ขออภัย เราไม่พบหน้าที่คุณกำลังค้นหา</p>
                                <p className="text-gray-500 mb-6">หน้านี้อาจถูกย้าย ลบ หรือไม่เคยมีอยู่</p>

                                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                                    <a href="/home" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg font-medium">
                                        <span className="flex items-center justify-center">
                                            <Home className="h-5 w-5 mr-2" />
                                            กลับสู่หน้าหลัก
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
};

export default NotFoundPage;