import NextAuth from "next-auth"
import config from "@/config/index";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@lib/mongodb";


export const authOptions = {
    // Set up database connection

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
}

export default NextAuth(authOptions)