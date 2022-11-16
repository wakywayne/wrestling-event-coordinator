'use client';

import { SessionProvider } from 'next-auth/react'
// set up apollo client
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const cache = new InMemoryCache({
    // By defining these type policies you protect yourself from potential mishaps
    typePolicies: {

    }
});

const client = new ApolloClient({
    uri: 'http://localhost:3000/api',
    cache
});


// type NewAppProps = Override<AppProps, { pageProps: { session: any } }>


export interface AuthContextProps {
    children: React.ReactNode;
}

export default function AuthContext({ children }: AuthContextProps) {
    return (
        <SessionProvider>
            <ApolloProvider client={client}>
                {children}
            </ApolloProvider>
        </SessionProvider>
    )
}

