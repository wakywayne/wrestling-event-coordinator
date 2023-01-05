import NextAuth, { NextAuthOptions } from "next-auth"
import config, { db } from "@/config/index";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import dbQueries from "@/lib/queries";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb";
import { JWT } from "graphql-scalars/typings/mocks";
import { ObjectId } from "mongodb";

interface JwtDecoded {
    name?: string,
    email: string,
    picture?: string,
    sub: string,
    iat: number,
}

interface SessionInterFace {
    user: {
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
        availableWeights?: number[] | null | undefined;
    }
    status: string;
}

export interface TheFinalSession {
    user: {
        name?: string,
        email: string,
        image?: string
        availableWeights?: []
    },
    expires: string,
    jwt: string,
}


export const authOptions: NextAuthOptions = {
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
    secret: process.env.NEXTAUTH_SECRET,

    // apparently this is not needed anymore????????
    pages: {
        signIn: '/login/signin',
        // signOut: '/',
    },


    session: {
        strategy: "jwt",
    },


    jwt: {
        // if you definde the env variable you don't need to define the secret here
        // secret: process.env.NEXTAUTH_SECRET,

        maxAge: 30 * 24 * 60 * 60, // 30 days

        // async encode({ token, secret }: { token: typeof JWT; secret: string }) {
        //     const jwt = require("jsonwebtoken");
        //     const encodedToken = jwt.sign(token, secret);
        //     return encodedToken;
        // },
        // async decode({ token, secret }: { token: typeof JWT; secret: string }) {
        //     const jwt = require("jsonwebtoken");
        //     const decodedToken = jwt.verify(token, secret);
        //     return decodedToken;
        // },

    },

    // This is for jwt stuff?
    callbacks: {
        // async signIn({ user, account, profile, email, credentials }: { user: Object; account: Object; profile: Object; email: Object; credentials: Object }) {
        //     return true
        // },

        // async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
        //     return baseUrl
        // },
        async jwt({ token, account, profile, session }: any) {
            return token
        },

        async session({ session, token, user }) {

            const dbUser = await dbQueries.getUserById(new ObjectId(token.sub));

            dbUser?.availableWeights ? session.user.availableWeights = dbUser.availableWeights : session.user.availableWeights = [];

            return session
        },


    },
}


export default NextAuth(authOptions)