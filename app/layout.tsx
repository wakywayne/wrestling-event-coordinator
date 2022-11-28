import '../styles/globals.css'
import AuthContext from './AuthContext';
import NavBar from '../components/NavBar';
import { Poppins, Inter } from '@next/font/google';

const poppins = Poppins({
    variable: '--font-poppins',
    weight: ['400', '500', '600', '700'],
});

const inter = Inter({
    subsets: ["latin"],
});


interface Props {
    children: React.ReactNode;
}

const RootLayout: React.FC<Props> = ({ children }) => {
    return (
        <html lang="en" className={`${poppins.variable} ${inter.className} p-0 m-0`}>
            <AuthContext>
                <body className='flex flex-col myContainer p-0 m-0 debug-screens' >

                    <div className="relative flex-grow bg-gradient-to-b from-white to-gray-300">
                        {/* <div className="relative flex-grow bg-gradient-to-b from-white to-gray-900"> */}
                        {/* <div className="relative flex-grow bg-gradient-to-b from-white to-black"> */}
                        <NavBar />
                        {children}
                    </div>
                </body>
            </AuthContext>
        </html>
    )
}

export default RootLayout;