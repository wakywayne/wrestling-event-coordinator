/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\nmutation CreateEvent($input: MutationCreateEventInput!){\n  createEvent(input:$input){\n        _id\n        name\n        description\n        cost\n        date\n        link\n    }\n}\n": types.CreateEventDocument,
    "\n    query EventsByLocation {\n    events {\n    _id \n    createdBy\n    name\n    date\n    description\n        }\n    }\n": types.EventsByLocationDocument,
    "\nquery GetEventsByDistance($coordinates: [Float!]!){\neventsByDistance(coordinates:$coordinates){\n    _id\n    createdBy\n    name\n    date\n    description\n    location{\n        coordinates\n    }\n}\n}\n": types.GetEventsByDistanceDocument,
    "\n    query EventsByWeightAndLocation {\n    events {\n    _id \n    createdBy\n    name\n    date\n    description\n        }\n    }\n": types.EventsByWeightAndLocationDocument,
    "\nquery GetEventsByWeight($weight: Int!, $plusOrMinus:Int){\neventsByWeight(weight:$weight, plusOrMinus:$plusOrMinus){\n    _id \n    createdBy\n    name\n    date\n    description\n  weights{\n    weight\n  }\n}\n}\n": types.GetEventsByWeightDocument,
    "\n    query EventsByWeight{\n    events {\n    _id \n    createdBy\n    name\n    date\n    description\n        }\n    }\n": types.EventsByWeightDocument,
    "\nquery GetEventById($id: mongoId!){\n  eventById(id:$id){\n    _id\n    name\n    description\n    cost\n    date\n    link\n    weights{\n      weight\n      spotsAvailable{\n        userId\n      }\n    }\n  }\n}\n": types.GetEventByIdDocument,
    "\nmutation ApplyToEvents($input: MutationApplyToEventInput!){\n  applyToEvent(input:$input)\n}\n": types.ApplyToEventsDocument,
    "\nquery UserByIdAppliedEvents {\n      userById{\n            signedUpEvents {\n                accepted\n                eventName\n                signedUpEventDate\n                signedUpEventId\n        }\n        }\n    }\n": types.UserByIdAppliedEventsDocument,
    "\nquery UserByIdCreatedEvents {\n      userById{\n            createdEvents {\n                createdEventId\n                eventName\n                createdEventDescription\n                createdEventDate\n                createdEventWeights{\n                    weight\n                    filled\n                }\n            }\n        }\n    }\n    \n": types.UserByIdCreatedEventsDocument,
    "\n    query EventById($id: mongoId!) {\n        eventById(id: $id) {\n            _id\n            name\n            description\n            location{\n              coordinates\n            }\n            date\n        \teventApplicants{\n            name\n            userId\n            weight\n          }\n        link\n        weights{\n          weight\n          spotsAvailable{\n            name\n            userId\n          }\n        }\n        }\n    }\n            ": types.EventByIdDocument,
    "\nquery UserByIdProfile {\n      userById{\n            name\n            email\n            availableWeights\n            createdEvents {\n                createdEventId\n                eventName\n                createdEventDescription\n                createdEventDate\n                createdEventWeights{\n                    weight\n                    filled\n                }\n            }\n            signedUpEvents {\n                accepted\n                eventName\n                signedUpEventDate\n                signedUpEventId\n        }\n        }\n    }\n": types.UserByIdProfileDocument,
    "\nquery UserByIdSettings {\n      userById{\n            name\n            email\n            availableWeights\n        }\n    }    \n": types.UserByIdSettingsDocument,
    "\nmutation UpdateUserSettings($input: MutationUpdateUserSettingsInput!){\n  updateUserSettings(input:$input){\n    name\n    email\n    availableWeights\n  }\n}\n": types.UpdateUserSettingsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation CreateEvent($input: MutationCreateEventInput!){\n  createEvent(input:$input){\n        _id\n        name\n        description\n        cost\n        date\n        link\n    }\n}\n"): (typeof documents)["\nmutation CreateEvent($input: MutationCreateEventInput!){\n  createEvent(input:$input){\n        _id\n        name\n        description\n        cost\n        date\n        link\n    }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query EventsByLocation {\n    events {\n    _id \n    createdBy\n    name\n    date\n    description\n        }\n    }\n"): (typeof documents)["\n    query EventsByLocation {\n    events {\n    _id \n    createdBy\n    name\n    date\n    description\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetEventsByDistance($coordinates: [Float!]!){\neventsByDistance(coordinates:$coordinates){\n    _id\n    createdBy\n    name\n    date\n    description\n    location{\n        coordinates\n    }\n}\n}\n"): (typeof documents)["\nquery GetEventsByDistance($coordinates: [Float!]!){\neventsByDistance(coordinates:$coordinates){\n    _id\n    createdBy\n    name\n    date\n    description\n    location{\n        coordinates\n    }\n}\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query EventsByWeightAndLocation {\n    events {\n    _id \n    createdBy\n    name\n    date\n    description\n        }\n    }\n"): (typeof documents)["\n    query EventsByWeightAndLocation {\n    events {\n    _id \n    createdBy\n    name\n    date\n    description\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetEventsByWeight($weight: Int!, $plusOrMinus:Int){\neventsByWeight(weight:$weight, plusOrMinus:$plusOrMinus){\n    _id \n    createdBy\n    name\n    date\n    description\n  weights{\n    weight\n  }\n}\n}\n"): (typeof documents)["\nquery GetEventsByWeight($weight: Int!, $plusOrMinus:Int){\neventsByWeight(weight:$weight, plusOrMinus:$plusOrMinus){\n    _id \n    createdBy\n    name\n    date\n    description\n  weights{\n    weight\n  }\n}\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query EventsByWeight{\n    events {\n    _id \n    createdBy\n    name\n    date\n    description\n        }\n    }\n"): (typeof documents)["\n    query EventsByWeight{\n    events {\n    _id \n    createdBy\n    name\n    date\n    description\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetEventById($id: mongoId!){\n  eventById(id:$id){\n    _id\n    name\n    description\n    cost\n    date\n    link\n    weights{\n      weight\n      spotsAvailable{\n        userId\n      }\n    }\n  }\n}\n"): (typeof documents)["\nquery GetEventById($id: mongoId!){\n  eventById(id:$id){\n    _id\n    name\n    description\n    cost\n    date\n    link\n    weights{\n      weight\n      spotsAvailable{\n        userId\n      }\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation ApplyToEvents($input: MutationApplyToEventInput!){\n  applyToEvent(input:$input)\n}\n"): (typeof documents)["\nmutation ApplyToEvents($input: MutationApplyToEventInput!){\n  applyToEvent(input:$input)\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery UserByIdAppliedEvents {\n      userById{\n            signedUpEvents {\n                accepted\n                eventName\n                signedUpEventDate\n                signedUpEventId\n        }\n        }\n    }\n"): (typeof documents)["\nquery UserByIdAppliedEvents {\n      userById{\n            signedUpEvents {\n                accepted\n                eventName\n                signedUpEventDate\n                signedUpEventId\n        }\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery UserByIdCreatedEvents {\n      userById{\n            createdEvents {\n                createdEventId\n                eventName\n                createdEventDescription\n                createdEventDate\n                createdEventWeights{\n                    weight\n                    filled\n                }\n            }\n        }\n    }\n    \n"): (typeof documents)["\nquery UserByIdCreatedEvents {\n      userById{\n            createdEvents {\n                createdEventId\n                eventName\n                createdEventDescription\n                createdEventDate\n                createdEventWeights{\n                    weight\n                    filled\n                }\n            }\n        }\n    }\n    \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query EventById($id: mongoId!) {\n        eventById(id: $id) {\n            _id\n            name\n            description\n            location{\n              coordinates\n            }\n            date\n        \teventApplicants{\n            name\n            userId\n            weight\n          }\n        link\n        weights{\n          weight\n          spotsAvailable{\n            name\n            userId\n          }\n        }\n        }\n    }\n            "): (typeof documents)["\n    query EventById($id: mongoId!) {\n        eventById(id: $id) {\n            _id\n            name\n            description\n            location{\n              coordinates\n            }\n            date\n        \teventApplicants{\n            name\n            userId\n            weight\n          }\n        link\n        weights{\n          weight\n          spotsAvailable{\n            name\n            userId\n          }\n        }\n        }\n    }\n            "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery UserByIdProfile {\n      userById{\n            name\n            email\n            availableWeights\n            createdEvents {\n                createdEventId\n                eventName\n                createdEventDescription\n                createdEventDate\n                createdEventWeights{\n                    weight\n                    filled\n                }\n            }\n            signedUpEvents {\n                accepted\n                eventName\n                signedUpEventDate\n                signedUpEventId\n        }\n        }\n    }\n"): (typeof documents)["\nquery UserByIdProfile {\n      userById{\n            name\n            email\n            availableWeights\n            createdEvents {\n                createdEventId\n                eventName\n                createdEventDescription\n                createdEventDate\n                createdEventWeights{\n                    weight\n                    filled\n                }\n            }\n            signedUpEvents {\n                accepted\n                eventName\n                signedUpEventDate\n                signedUpEventId\n        }\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery UserByIdSettings {\n      userById{\n            name\n            email\n            availableWeights\n        }\n    }    \n"): (typeof documents)["\nquery UserByIdSettings {\n      userById{\n            name\n            email\n            availableWeights\n        }\n    }    \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation UpdateUserSettings($input: MutationUpdateUserSettingsInput!){\n  updateUserSettings(input:$input){\n    name\n    email\n    availableWeights\n  }\n}\n"): (typeof documents)["\nmutation UpdateUserSettings($input: MutationUpdateUserSettingsInput!){\n  updateUserSettings(input:$input){\n    name\n    email\n    availableWeights\n  }\n}\n"];

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
**/
export function gql(source: string): unknown;

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;