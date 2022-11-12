import { signIn, useSession, signOut } from 'next-auth/react'
import { useState, } from 'react';
import Link from 'next/link';
import useRouter from 'next/router';
import { BsGoogle, BsFacebook } from 'react-icons/bs';

interface Props {

}


const SignInForm: React.FC<Props> = () => {

    const [email, setEmail] = useState('');

    const { data: session, status } = useSession();
    const { push, asPath } = useRouter();

    const providers = [
        {
            name: 'Google',
            Icon: BsGoogle,
        },
        {
            name: 'Facebook',
            Icon: BsFacebook,
        },
    ]

    const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        await signIn('email', { email, })
        // push(asPath)
    }

    const handleAuthSignIn = async (name: string) => {
        // make name all lowercase
        name = name.toLowerCase();
        await signIn(name)
    }

    if (!session) {
        return (
            <div className=''>
                <form className="py-5 border-8 rounded-md px-7">
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="flex items-center justify-between mb-3">
                        <button
                            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                            type="button" onClick={(e) => { handleSignIn(e) }}>
                            Sign In
                        </button>
                        <a className="inline-block text-sm font-bold text-blue-500 align-baseline hover:text-blue-800"
                            href="#">
                            New Here?
                        </a>
                    </div>

                    <div className="grid grid-flow-row grid-row">
                        {providers.map(({ name, Icon }, index) => {
                            return (
                                <div key={`${name} ${index}`} className='flex justify-start p-3 border rounded hover:cursor-pointer' onClick={() => { handleAuthSignIn(name) }}>
                                    <Icon className='m-3 ' />
                                    <p className='m-3 text-base '>Login with {name}</p>
                                </div>)
                        })}
                    </div>
                </form>
            </div>
        )
    } else {
        return (
            <div>
                <Link href='/'>
                    <p className='text-xl text-center align-middle'>You are already signed in silly <span className='text-blue-500 hover:text-blue-800'>click to go Home</span></p>
                </Link>
                <div onClick={() => signOut({ callbackUrl: 'http://localhost:3000/auth/signin?callbackUrl=/' })}>Or sign out</div>
            </div>
        )
    }
}

export default SignInForm;