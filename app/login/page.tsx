'use client';

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
interface Props {

}


const Login: React.FC<Props> = () => {
    const { data: session, } = useSession();

    const router = useRouter();


    const handleSignIn = () => router.push(`/login/signin?callbackUrl=/`);


    return (
        <div className=' mt-28'>
            {!session &&
                <div>
                    Not signed in <br />
                    <button onClick={() => { handleSignIn() }}>Sign in</button>
                </div>
            }

            {session?.user &&
                <div>
                    Signed in as {session.user.email} <br />
                    <button onClick={() => signOut()}>Sign out</button>
                </div>
            }
        </div>
    )
}

export default Login;