'use client'

import { signIn, useSession, signOut } from 'next-auth/react'
import { useState, } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BsGoogle, BsFacebook } from 'react-icons/bs';

interface Props {

}


const SignInForm: React.FC<Props> = () => {

    const [email, setEmail] = useState('');

    const { data: session, status } = useSession();
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
            <div className='relative bg-white border-2 border-black rounded-md '>
                {/* <div className='relative border-8 rounded-md bg-myDarkBlue border-myDarkRed '> */}
                <form className="py-5 px-7">
                    <div className="mb-4">
                        <input
                            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none outline-1 focus:outline-myRed focus:shadow-outline"
                            id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="flex items-center justify-between mb-3">
                        <button
                            className="px-4 py-2 font-bold text-white rounded bg-myGreen hover:bg-green-700 focus:outline-none focus:shadow-outline"
                            type="button" onClick={(e) => { handleSignIn(e) }}>
                            Sign In
                        </button>
                        <a className="inline-block text-sm font-bold align-baseline text-myBlue hover:text-myDarkBlue"
                            href="#">
                            Need Help?
                        </a>
                    </div>

                    <div className="grid grid-flow-row grid-row">
                        {providers.map(({ name, Icon }, index) => {
                            return (
                                <div key={`${name} ${index}`} className='flex justify-start p-3 my-1 bg-white border rounded hover:border-myRed hover:cursor-pointer' onClick={() => { handleAuthSignIn(name) }}>
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
            <div className=' bg-slate-300'>
                <Link href='/'>
                    <p className='text-xl text-center align-middle'>You are already signed in silly <span className='text-myBlue hover:text-myDarkBlue'>click to go Home</span></p>
                </Link>
                <div className='cursor-pointer text-myBlue hover:text-myDarkBlue' onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}>Or sign out</div>
            </div>
        )
    }
}

export default SignInForm;