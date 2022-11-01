import { createYoga } from 'graphql-yoga'
import { ObjectId } from 'bson';
import { DateTimeResolver, ObjectIDResolver } from 'graphql-scalars';
import SchemaBuilder, { initContextCache } from "@pothos/core"
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import WithInputPlugin from "@pothos/plugin-with-input"
import {
    User, createdEvents, userSignedUpEvents, weightsForUserCreatedEvents,
    Event as EventType, weightsForEvent, spotsAvailableForEvent, applicant
} from 'gql';
import axios from 'axios';
import { apiUrl } from '@/config/index';
import dbQueries from '@lib/queries';
import dbMutations from '@lib/mutations';
import { errorIfPromiseFalse } from 'utils';
import { NextApiRequest, NextApiResponse } from 'next';


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

    Scalars: {
        Date: {
            Input: Date;
            Output: Date;
        };
        mongoId: {
            Input: ObjectId;
            Output: ObjectId;
        };
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



// Custom Scalars 

builder.addScalarType('mongoId', ObjectIDResolver, {});
builder.addScalarType('Date', DateTimeResolver, {});



builder.objectType(User, {
    name: 'User',

    fields: (t) => ({
        _id: t.field({
            // type: 'String',
            type: 'mongoId',
            // nullable: false,
            // When we create a user it will expect an id if this is not nullable
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
            type: [userSignedUpEvents],
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





builder.objectType(createdEvents, {
    name: 'createdEvents',
    fields: (t) => ({
        createdEventId: t.field({
            // type: 'String',
            type: 'mongoId',
            nullable: false,
            resolve: (createdEvents) => createdEvents.createdEventId
        }),
        eventName: t.exposeString('createdEventName', { nullable: false }),
        createdEventDate: t.field({
            type: 'Date',
            nullable: false,
            resolve: (createdEvents) => createdEvents.createdEventDate
        }),
        createdEventDescription: t.exposeString('createdEventDescription', { nullable: false }),
        createdEventViewedApplicants: t.exposeBoolean('createdEventViewedApplicants', { nullable: false }),
        createdEventCost: t.exposeString('createdEventCost'),
        createdEventLink: t.exposeString('createdEventLink'),
        createdEventWeights: t.field({
            type: [weightsForUserCreatedEvents],
            resolve: (parent, args, context) => {
                if (!Array.isArray(parent.createdEventWeights) || !parent.createdEventWeights.length) {
                    return [];
                } else {
                    return parent.createdEventWeights;
                }
            }
        }),
    })
})


builder.objectType(weightsForUserCreatedEvents, {
    name: 'weightsForUserCreatedEvents',
    fields: (t) => ({
        weight: t.exposeString('weight'),
        // I might t want to make this a field type  and return an empty object if filled is an empty array
        filled: t.exposeBooleanList('filled'),
    })
})


builder.objectType(userSignedUpEvents, {
    name: 'userSignedUpEvents',
    fields: (t) => ({
        signedUpEventId: t.field({
            // type: 'String',
            type: 'mongoId',
            nullable: false,
            resolve: (parent) => parent.eventId
        }),
        eventName: t.exposeString('eventName', { nullable: false }),
        signedUpEventDate: t.field({
            // type: Date,
            type: 'Date',
            nullable: false,
            resolve: (parent) => parent.eventDate
        }),
        accepted: t.exposeBoolean('accepted', { nullable: false }),
    })
})






builder.objectType(EventType, {
    name: 'Event',
    fields: (t) => ({
        _id: t.field({
            // type: 'String',
            type: 'mongoId',
            nullable: false,
            resolve: (event) => event._id
        }),
        eventName: t.exposeString('name', { nullable: false }),
        eventDate: t.field({
            // type: Date,
            type: 'Date',
            nullable: false,
            resolve: (event) => event.date
        }),
        eventDescription: t.exposeString('description', { nullable: false }),
        eventCost: t.exposeString('cost'),
        eventLink: t.exposeString('eventLink'),
        eventWeights: t.field({
            type: [weightsForEvent],
            resolve: (parent, args, context) => {
                if (!Array.isArray(parent.weights) || !parent.weights.length) {
                    return [];
                } else {
                    return parent.weights;
                }
            }

        }),
        eventApplicants: t.field({
            type: [applicant],
            resolve: (parent, args, context) => {
                if (!Array.isArray(parent.eventApplicants) || !parent.eventApplicants.length) {
                    return [];
                } else {
                    return parent.eventApplicants;
                }
            }
        })
    })
})



builder.objectType(applicant, {
    name: 'applicant',
    fields: (t) => ({
        userId: t.field({
            type: 'mongoId',
            nullable: false,
            resolve: (parent) => parent.userId
        }),
        name: t.exposeString('name', { nullable: false }),
        weight: t.exposeInt('weight', { nullable: false }),
    })
})



builder.objectType(spotsAvailableForEvent, {
    name: 'spotsAvailableForEvent',
    fields: (t) => ({
        userId: t.field({
            // type: 'String',
            type: 'mongoId',
            resolve: (parent) => parent.userId
        }),
        name: t.exposeString('name'),

    })
})



builder.objectType(weightsForEvent, {
    name: 'weightsForEvent',
    fields: (t) => ({
        weight: t.exposeInt('weight'),
        spotsAvailable: t.field({
            // type: spotsAvailableForEvent,
            type: [spotsAvailableForEvent],
            resolve: (parent, args, context) => {
                if (!Array.isArray(parent.spotsAvailable) || !parent.spotsAvailable) {
                    return [];
                } else {
                    return parent.spotsAvailable;
                }
            }
        }),

    })
})







builder.queryType({
    fields: (t) => ({
        // Get all users from exampleUsers
        users: t.field({
            type: [User],
            resolve: async () => {
                try {
                    return await errorIfPromiseFalse(dbQueries.getUsers(), 'No users found');
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        userById: t.field({
            type: User,
            args: {
                id: t.arg({ type: 'mongoId', required: true })
            },
            resolve: async (parent, args, context) => {
                try {
                    return await errorIfPromiseFalse(dbQueries.getUserById(args.id), 'Error finding user by id')
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        events: t.field({
            type: [EventType],
            resolve: async () => {
                try {
                    return errorIfPromiseFalse(dbQueries.getEvents(), 'No events found')
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        eventById: t.field({
            type: EventType,
            args: {
                id: t.arg({ type: 'mongoId', required: true })
            },
            resolve: async (parent, args, context) => {
                try {
                    return errorIfPromiseFalse(dbQueries.getEventById(args.id), 'Error finding event by id')
                } catch (err) {
                    console.log(err)
                }
            }
        }),
    })
})










builder.mutationType({
    fields: (t) => ({
        // Create a new user
        createUser: t.fieldWithInput({
            input: {
                name: t.input.string({ required: true }),
                email: t.input.string({ required: true }),
                password: t.input.string(),
            },
            type: 'mongoId',
            resolve: async (parent, { input: { name, email, password } }, context) => {

                if (password) {
                    const user = await dbMutations.createUser({ name, email, password })
                    console.log(user)
                    return user;
                } else {
                    const user = await dbMutations.createUser({ name, email })
                    console.log(user)
                    return user;
                }
            }
        }),
    })
})

const schema = builder.toSchema({})

export const config = {
    api: {
        // Disable body parsing (required for file uploads)
        bodyParser: false
    }
}

export default createYoga<{
    req: NextApiRequest
    res: NextApiResponse
}>({
    // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
    schema,
    graphqlEndpoint: '/api'
})


// const server = createServer({
//     endpoint: '/api/graphql',
//     schema: schema,
//     context: async ({ req }: any) => {

//         if (req.headers.user) {
//             const user = await fetchUser(`${apiUrl}/api/auth/return/${req.headers.user}`);
//             const parsedUser = JSON.parse(user);
//             console.log({ parsedUser });

//             return {
//                 currentUser: parsedUser
//             }
//         } else {
//             null
//         }
//     }
// })


// export default server;