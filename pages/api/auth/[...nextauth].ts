import NextAuth from "next-auth"
import config from "@/config/index";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@lib/mongodb";
import { JWT } from "graphql-scalars/typings/mocks";


export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        EmailProvider({
            server: {
                host: config.authProviders.email.host,
                port: config.authProviders.email.port,
                auth: {
                    user: config.authProviders.email.user,
                    pass: config.authProviders.email.password,
                }
            },
            from: config.authProviders.email.from,
        }),
        GoogleProvider({
            clientId: config.authProviders.google.id ? config.authProviders.google.id : "",
            clientSecret: config.authProviders.google.secret ? config.authProviders.google.secret : "",
        }),
        FacebookProvider({
            clientId: config.authProviders.facebook.id ? config.authProviders.facebook.id : "",
            clientSecret: config.authProviders.facebook.secret ? config.authProviders.facebook.secret : "",
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    secret: process.env.JWT_SECRET,
    // This is to make a custom sign in page
    pages: {
        signIn: "/auth/signin",
        //     signOut: "/auth/signout",
    },
    // from here down is only needed if you need to store information besides name and email on the session via jwt 
    // the following events occur in the order they are written 
    session: {
        strategy: "jwt",
    },
    // set up jwt token
    jwt: {
        secret: process.env.JWT_SECRET,
        maxAge: 30 * 24 * 60 * 60, // 30 days

        async encode({ token, secret }: any) {
            const jwt = require("jsonwebtoken");
            const encodedToken = jwt.sign(token, secret);
            return encodedToken;
        },
        async decode({ token, secret }: any) {
            const jwt = require("jsonwebtoken");
            const decodedToken = jwt.verify(token, secret);
            return decodedToken;
        },
    },

    // This is for jwt stuff?
    callbacks: {
        jwt: async ({ token, user }: any) => {
            console.log({ jwt: token, user });
            if (token.sub) {
                return token
            } else {
                return null
            }

        },
        session: async ({ session, token }: any) => {
            console.log({ session, token });
            const jwt = require("jsonwebtoken");
            const safeJwt = jwt.sign(token, process.env.JWT_SECRET);
            session.jwt = safeJwt;
            console.log({ theSession: session })
            return session
        },
    },
}

export default NextAuth(authOptions)