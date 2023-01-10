'use client';

import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { Override } from 'types'

type NewAppProps = Override<AppProps, { pageProps: { session: any } }>

function MyApp({ Component, pageProps: { session, ...pageProps } }: NewAppProps) {
    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    )
}

export default MyApp