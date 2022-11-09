import { createYoga } from 'graphql-yoga'
import { ObjectId } from 'bson';
import { DateTimeResolver, ObjectIDResolver, JSONDefinition, JSONResolver } from 'graphql-scalars';
import SchemaBuilder, { initContextCache } from "@pothos/core"
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import WithInputPlugin from "@pothos/plugin-with-input"
import {
    User, createdEvents, userSignedUpEvents, weightsForUserCreatedEvents,
    Event as EventType, weightsForEvent, spotsAvailableForEvent, applicant, Location, Empty
} from 'gql';
import axios from 'axios';
// import { getSession } from 'next-auth/react';
import { unstable_getServerSession } from "next-auth/next"
import { apiUrl } from '@/config/index';
import dbQueries from '@lib/queries';
import dbMutations from '@lib/mutations';
import { errorIfPromiseFalse } from 'utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions, TheFinalSession } from './auth/[...nextauth]';
import { type } from 'os';
import { JSON } from 'graphql-scalars/typings/mocks';


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
        // paidUser: boolean,
        // admin: boolean,
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
        JSONObject: {
            Input: any;
            Output: any;
        };
        objectIdOrEmpty: {
            Input: ObjectId | Empty;
            Output: ObjectId | Empty;
        };
    };
    DefaultFieldNullability: true;

}>({
    plugins: [
        ScopeAuthPlugin,
        WithInputPlugin
    ],

    authScopes: async (context) => ({
        public: context.currentUser === null,
        // eagerly evaluated scope
        user: context.currentUser !== null && context.currentUser !== undefined && context.currentUser.email !== null,
        // user: context.currentUser!==null&&context.currentUser.paid===false,
        // user: false,
        // paidUser: context.currentUser.paid===true,
        // evaluated when used 
        // admin: context.currentUser!==null&&context.currentUser.admin===true,
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
// builder.addScalarType('JSONObject', JSONResolver, {});

builder.scalarType('JSONObject', {
    serialize: (value) => {
        return value;
    },

    parseValue: (value: any) => {
        if (value !== null && value !== undefined) {
            return value;
        }
        else {
            throw new Error('JSONObject cannot represent non-object value: ' + value);
        }
    }
})
// builder.scalarType('JSONObject', {
//     serialize: (value) => {
//         let o = JSON.parse(JSON.stringify(value));
//         if (o && o._id) {
//             return o
//         } else {
//             throw new Error('Not a valid JSON Object');
//         }
//     },

//     parseValue: (value) => {
//         if (typeof value === 'object') {
//             return value
//         } else
//             throw new Error('Invalid value for Json Type Custom Scalar');
//     }
// })


// create a scalar type that can be either an ObjectId or an empty string
builder.scalarType('objectIdOrEmpty', {
    serialize: (value) => value,

    parseValue: (value) => {
        if (value === 'empty') {
            return 'empty';
        } else if (typeof value === 'string') {
            const isObject = ObjectId.isValid(value);
            if (isObject) {
                return new ObjectId(value);
            } else {
                throw new Error('Value is not a valid object id according to custom scalar');
            }
        }


        throw new Error('Invalid value for ObjectIdOrEmpty Custom Scalar');
    }
}
);





// User object type
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
        name: t.exposeString('name'),
        email: t.exposeString('email', { nullable: false }),
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


// On the user type
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

// On the user type
builder.objectType(weightsForUserCreatedEvents, {
    name: 'weightsForUserCreatedEvents',
    fields: (t) => ({
        weight: t.exposeString('weight'),
        // I might t want to make this a field type  and return an empty object if filled is an empty array
        filled: t.exposeBooleanList('filled'),
    })
})

// On the user type
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

builder.objectType(Location, {
    name: 'Location',
    fields: (t) => ({
        type: t.exposeString('type', { nullable: false }),
        coordinates: t.exposeFloatList('coordinates', { nullable: false }),
    })
})






// Event object type
builder.objectType(EventType, {
    name: 'Event',
    fields: (t) => ({
        _id: t.field({
            // type: 'String',
            type: 'mongoId',
            // nullable: false,
            resolve: (event) => event._id
        }),
        createdBy: t.field({
            type: 'mongoId',
            nullable: false,
            resolve: (event) => event.createdBy
        }),
        location: t.field({
            type: Location,
            nullable: false,
            resolve: (event) => event.location
        }),
        name: t.exposeString('name', { nullable: false }),
        date: t.field({
            // type: Date,
            type: 'Date',
            nullable: false,
            resolve: (event) => event.date
        }),
        description: t.exposeString('description', { nullable: false }),
        cost: t.exposeString('cost'),
        link: t.exposeString('link'),
        weights: t.field({
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

// On the event type
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

const weightsForEventInput = builder.inputType('weightsForEventInput', {
    fields: (t) => ({
        weight: t.int(),
        spotsAvailable: t.field({
            type: [spotsAvailableForEventInput],
        })
    })
})



// On the event type
builder.objectType(applicant, {
    name: 'applicant',
    fields: (t) => ({
        userId: t.field({
            type: 'objectIdOrEmpty',
            nullable: false,
            resolve: (parent) => parent.userId
        }),
        name: t.exposeString('name', { nullable: false }),
        weight: t.exposeInt('weight', { nullable: false }),
    })
})

// On the event type
builder.objectType(spotsAvailableForEvent, {
    name: 'spotsAvailableForEvent',
    fields: (t) => ({
        userId: t.field({
            // type: 'String',
            type: 'objectIdOrEmpty',
            resolve: (parent) => parent.userId
        }),
        name: t.exposeString('name'),

    })
})
// On the event input
const spotsAvailableForEventInput = builder.inputType("spotsAvailableForEventInput", {
    fields: (t) => ({
        userId: t.field({
            type: 'objectIdOrEmpty',
        }),
        name: t.string(),
    })
})







// This is our root query type
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
        // Get a user by id
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
        // Get all events 
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
        // Get an event by id
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



// Root Mutation type
builder.mutationType({
    fields: (t) => ({

        // Logged In user EVENT mutations Below
        // ------------------------------------

        // Create a user we don't use this I will remove before prod
        createUser: t.field({
            args: {
                email: t.arg({ type: 'String', required: true }),
            },
            type: 'mongoId',
            resolve: async (parent, { email }, context) => {

                const user = await dbMutations.createUser({ email })
                console.log(user)
                return user;
            }
        }),

        // Creating an event
        createEvent: t.fieldWithInput({
            input: {
                longitude: t.input.float({ required: true }),
                latitude: t.input.float({ required: true }),
                name: t.input.string({ required: true }),
                date: t.input.field({ type: 'Date', required: true }),
                description: t.input.string({ required: true }),
                cost: t.input.string(),
                link: t.input.string(),
                weights: t.input.field({ type: [weightsForEventInput] })
            },
            type: EventType,
            resolve: (_, { input: { longitude, latitude, name, date, description, cost, link, weights, } }, context) => {

                const location: Location = {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                }
                let anObject = {
                    createdBy: context.currentUser._id as ObjectId, location, name, date, description,
                    cost: cost ? (cost) : undefined, link: link ? link : undefined, weights: weights ? weights : undefined
                }


                return dbMutations.createEvent(anObject);
            }
        }),

        // Update an event
        updateEvent: t.fieldWithInput({
            input: {
                _id: t.input.field({ type: 'mongoId', required: true }),
                longitude: t.input.float({ required: true }),
                latitude: t.input.float({ required: true }),
                name: t.input.string({ required: true }),
                date: t.input.field({ type: 'Date', required: true }),
                description: t.input.string({ required: true }),
                cost: t.input.string(),
                link: t.input.string(),
                weights: t.input.field({ type: [weightsForEventInput] })
            },
            type: EventType,
            resolve: (_, { input: { _id, longitude, latitude, name, date, description, cost, link, weights, } }, context) => {


                const location: Location = {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                }
                let anObject = {
                    _id, location, name, date, description,
                    cost: cost ? (cost) : undefined, link: link ? link : undefined, weights: weights ? weights : undefined
                }


                return dbMutations.updateEvent(context.currentUser._id, anObject);
            }
        }),

        // Delete an event
        deleteEvent: t.field({
            args: {
                id: t.arg({ type: 'mongoId', required: true })
            },
            type: 'Boolean',
            resolve: async (parent, args, context) => {
                try {
                    return await errorIfPromiseFalse(dbMutations.deleteEvent(args.id, context.currentUser._id), 'Error deleting event')
                } catch (err) {
                    console.log(err)
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
    graphqlEndpoint: '/api',
    schema,
    context: async ({ req, res }: { req: NextApiRequest; res: NextApiResponse }) => {
        // @ts-ignore
        const session: TheFinalSession = await unstable_getServerSession(req, res, authOptions)
        const jwt = require("jsonwebtoken");

        if (session) {
            if (session.jwt) {
                const decodedToken = jwt.verify(session.jwt, process.env.JWT_SECRET);
                const user = await dbQueries.getUserById(decodedToken.sub);
                return { currentUser: user }
            } else {
                return { currentUser: null }
            }
        } else {
            return { currentUser: null }
        }
    },

}
)

