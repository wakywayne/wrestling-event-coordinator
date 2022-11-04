import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
interface Props {

}


const Login: React.FC<Props> = () => {
    const { data: session, } = useSession();

    const { push, asPath } = useRouter();

    const handleSignIn = () => push(`/auth/signin?callbackUrl=${asPath}`)


    return (
        <div>
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