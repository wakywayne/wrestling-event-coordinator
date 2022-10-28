import { createServer } from '@graphql-yoga/node'
import { ObjectId } from 'bson';
import SchemaBuilder from "@pothos/core"
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import WithInputPlugin from "@pothos/plugin-with-input"
import { User, createdEvents, userSignUp } from 'gql';
import axios from 'axios';
import { apiUrl } from '@/config/index';




const fetchUser = async (url: string) => {
    try {
        const response = await axios(url);
        const data = response.data;
        return data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(error.response?.data);
        } else {
            console.log(error);
        }
    }
}



const builder = new SchemaBuilder<{
    Context: {
        currentUser: User;
    };

    AuthScopes: {
        public: boolean,
        user: boolean,
        admin: boolean,
    };

    DefaultFieldNullability: true;

}>({
    plugins: [
        ScopeAuthPlugin,
        WithInputPlugin
    ],

    authScopes: async (context) => ({
        public: true,
        // eagerly evaluated scope
        user: context.currentUser ? context.currentUser.name == 'test' : false,
        // user: false,
        // evaluated when used 
        admin: false
        // scope loader with argument
    }),

    defaultFieldNullability: true,

    withInput: {
        // Go over this
        typeOptions: {
            // default options for Input object types created by this plugin
        },
        argOptions: {
            // set required: false to override default behavior
        },
    },
});





builder.objectType(User, {
    name: 'User',

    fields: (t) => ({
        _id: t.field({
            type: ObjectId,
            nullable: false,
            resolve: (user) => user._id
        }),
        name: t.exposeString('name', { nullable: false }),
        email: t.exposeString('email', { nullable: false }),
        password: t.exposeString('password'),
        availableWeights: t.exposeIntList('availableWeights'),
        createdEvents: t.field({
            type: [createdEvents],
            resolve: (parent, args, context) => {
                if (!Array.isArray(parent.createdEvents) || !parent.createdEvents.length) {
                    return [];
                } else {
                    return parent.createdEvents;
                }
            }
        }),
        signedUpEvents: t.field({
            type: [userSignUp],
            resolve: (parent, args, context) => {

                if (!Array.isArray(parent.signedUpEvents) || !parent.signedUpEvents.length) {
                    return [];
                } else {
                    return parent.signedUpEvents;
                }
            }
        })
    })
})




const server = createServer({
    endpoint: '/api',
    schema: builder.toSchema(),
    context: async ({ req }) => {

        if (req.headers.user) {
            const user = await fetchUser(`${apiUrl}/api/auth/return/${req.headers.user}`);
            const parsedUser = JSON.parse(user);
            console.log({ parsedUser });

            return {
                currentUser: parsedUser
            }
        } else {
            null
        }
    }
})


export default server;