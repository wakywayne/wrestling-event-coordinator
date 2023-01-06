/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: any;
  JSONObject: any;
  /** A field whose value conforms with the standard mongodb object ID as described here: https://docs.mongodb.com/manual/reference/method/ObjectId/#ObjectId. Example: 5e5677d71bdc2ae76344968c */
  mongoId: any;
  objectIdOrEmpty: any;
};

export type Event = {
  __typename?: 'Event';
  _id?: Maybe<Scalars['mongoId']>;
  cost?: Maybe<Scalars['String']>;
  createdBy: Scalars['mongoId'];
  date: Scalars['Date'];
  description: Scalars['String'];
  eventApplicants?: Maybe<Array<Applicant>>;
  link?: Maybe<Scalars['String']>;
  location: Location;
  name: Scalars['String'];
  weights?: Maybe<Array<WeightsForEvent>>;
};

export type Location = {
  __typename?: 'Location';
  coordinates: Array<Scalars['Float']>;
  type: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptApplicant?: Maybe<Scalars['Boolean']>;
  applyToEvent?: Maybe<Scalars['Boolean']>;
  createEvent?: Maybe<Event>;
  deleteEvent?: Maybe<Scalars['Boolean']>;
  updateEvent?: Maybe<Event>;
  updateUserSettings?: Maybe<User>;
};


export type MutationAcceptApplicantArgs = {
  input: MutationAcceptApplicantInput;
};


export type MutationApplyToEventArgs = {
  input: MutationApplyToEventInput;
};


export type MutationCreateEventArgs = {
  input: MutationCreateEventInput;
};


export type MutationDeleteEventArgs = {
  id: Scalars['mongoId'];
};


export type MutationUpdateEventArgs = {
  input: MutationUpdateEventInput;
};


export type MutationUpdateUserSettingsArgs = {
  input: MutationUpdateUserSettingsInput;
};

export type MutationAcceptApplicantInput = {
  applicantId: Scalars['mongoId'];
  applicantName: Scalars['String'];
  boolean: Scalars['Boolean'];
  createdBy: Scalars['mongoId'];
  eventId: Scalars['mongoId'];
  weight: Scalars['Float'];
};

export type MutationApplyToEventInput = {
  eventDate: Scalars['Date'];
  eventId: Scalars['mongoId'];
  eventName: Scalars['String'];
  name: Scalars['String'];
  weight: Scalars['Float'];
};

export type MutationCreateEventInput = {
  cost?: InputMaybe<Scalars['String']>;
  date: Scalars['Date'];
  description: Scalars['String'];
  latitude: Scalars['Float'];
  link?: InputMaybe<Scalars['String']>;
  longitude: Scalars['Float'];
  name: Scalars['String'];
  weights?: InputMaybe<Array<WeightsForEventInput>>;
};

export type MutationUpdateEventInput = {
  _id: Scalars['mongoId'];
  cost?: InputMaybe<Scalars['String']>;
  date: Scalars['Date'];
  description: Scalars['String'];
  latitude: Scalars['Float'];
  link?: InputMaybe<Scalars['String']>;
  longitude: Scalars['Float'];
  name: Scalars['String'];
  weights?: InputMaybe<Array<WeightsForEventInput>>;
};

export type MutationUpdateUserSettingsInput = {
  availableWeights: Array<Scalars['Float']>;
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  eventById?: Maybe<Event>;
  events?: Maybe<Array<Event>>;
  eventsByDistance?: Maybe<Array<Event>>;
  eventsByWeight?: Maybe<Array<Event>>;
  userById?: Maybe<User>;
  users?: Maybe<Array<User>>;
};


export type QueryEventByIdArgs = {
  id: Scalars['mongoId'];
};


export type QueryEventsByDistanceArgs = {
  coordinates: Array<Scalars['Float']>;
};


export type QueryEventsByWeightArgs = {
  plusOrMinus?: InputMaybe<Scalars['Int']>;
  weight: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  _id?: Maybe<Scalars['mongoId']>;
  availableWeights?: Maybe<Array<Scalars['Int']>>;
  createdEvents?: Maybe<Array<CreatedEvents>>;
  email: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  signedUpEvents?: Maybe<Array<UserSignedUpEvents>>;
};

export type Applicant = {
  __typename?: 'applicant';
  name: Scalars['String'];
  userId: Scalars['objectIdOrEmpty'];
  weight: Scalars['Int'];
};

export type CreatedEvents = {
  __typename?: 'createdEvents';
  createdEventCost?: Maybe<Scalars['String']>;
  createdEventDate: Scalars['Date'];
  createdEventDescription: Scalars['String'];
  createdEventId: Scalars['mongoId'];
  createdEventLink?: Maybe<Scalars['String']>;
  createdEventWeights?: Maybe<Array<WeightsForUserCreatedEvents>>;
  eventName: Scalars['String'];
};

export type SpotsAvailableForEvent = {
  __typename?: 'spotsAvailableForEvent';
  name?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['objectIdOrEmpty']>;
};

export type SpotsAvailableForEventInput = {
  name?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['objectIdOrEmpty']>;
};

export type UserSignedUpEvents = {
  __typename?: 'userSignedUpEvents';
  accepted: Scalars['Boolean'];
  eventName: Scalars['String'];
  signedUpEventDate: Scalars['Date'];
  signedUpEventId: Scalars['mongoId'];
};

export type WeightsForEvent = {
  __typename?: 'weightsForEvent';
  spotsAvailable?: Maybe<Array<SpotsAvailableForEvent>>;
  weight?: Maybe<Scalars['Int']>;
};

export type WeightsForEventInput = {
  spotsAvailable?: InputMaybe<Array<SpotsAvailableForEventInput>>;
  weight?: InputMaybe<Scalars['Int']>;
};

export type WeightsForUserCreatedEvents = {
  __typename?: 'weightsForUserCreatedEvents';
  filled?: Maybe<Array<Scalars['Boolean']>>;
  weight?: Maybe<Scalars['Float']>;
};

export type CreateEventMutationVariables = Exact<{
  input: MutationCreateEventInput;
}>;


export type CreateEventMutation = { __typename?: 'Mutation', createEvent?: { __typename?: 'Event', _id?: any | null, name: string, description: string, cost?: string | null, date: any, link?: string | null } | null };

export type EventsByLocationQueryVariables = Exact<{ [key: string]: never; }>;


export type EventsByLocationQuery = { __typename?: 'Query', events?: Array<{ __typename?: 'Event', _id?: any | null, createdBy: any, name: string, date: any, description: string }> | null };

export type GetEventsByDistanceQueryVariables = Exact<{
  coordinates: Array<Scalars['Float']> | Scalars['Float'];
}>;


export type GetEventsByDistanceQuery = { __typename?: 'Query', eventsByDistance?: Array<{ __typename?: 'Event', _id?: any | null, createdBy: any, name: string, date: any, description: string, location: { __typename?: 'Location', coordinates: Array<number> } }> | null };

export type EventsByWeightAndLocationQueryVariables = Exact<{ [key: string]: never; }>;


export type EventsByWeightAndLocationQuery = { __typename?: 'Query', events?: Array<{ __typename?: 'Event', _id?: any | null, createdBy: any, name: string, date: any, description: string }> | null };

export type GetEventsByWeightQueryVariables = Exact<{
  weight: Scalars['Int'];
  plusOrMinus?: InputMaybe<Scalars['Int']>;
}>;


export type GetEventsByWeightQuery = { __typename?: 'Query', eventsByWeight?: Array<{ __typename?: 'Event', _id?: any | null, createdBy: any, name: string, date: any, description: string, weights?: Array<{ __typename?: 'weightsForEvent', weight?: number | null }> | null }> | null };

export type EventsByWeightQueryVariables = Exact<{ [key: string]: never; }>;


export type EventsByWeightQuery = { __typename?: 'Query', events?: Array<{ __typename?: 'Event', _id?: any | null, createdBy: any, name: string, date: any, description: string }> | null };

export type GetEventByIdQueryVariables = Exact<{
  id: Scalars['mongoId'];
}>;


export type GetEventByIdQuery = { __typename?: 'Query', eventById?: { __typename?: 'Event', _id?: any | null, name: string, description: string, cost?: string | null, date: any, link?: string | null, weights?: Array<{ __typename?: 'weightsForEvent', weight?: number | null, spotsAvailable?: Array<{ __typename?: 'spotsAvailableForEvent', userId?: any | null }> | null }> | null } | null };

export type ApplyToEventsMutationVariables = Exact<{
  input: MutationApplyToEventInput;
}>;


export type ApplyToEventsMutation = { __typename?: 'Mutation', applyToEvent?: boolean | null };

export type UserByIdAppliedEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserByIdAppliedEventsQuery = { __typename?: 'Query', userById?: { __typename?: 'User', signedUpEvents?: Array<{ __typename?: 'userSignedUpEvents', accepted: boolean, eventName: string, signedUpEventDate: any, signedUpEventId: any }> | null } | null };

export type UserByIdCreatedEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserByIdCreatedEventsQuery = { __typename?: 'Query', userById?: { __typename?: 'User', createdEvents?: Array<{ __typename?: 'createdEvents', createdEventId: any, eventName: string, createdEventDescription: string, createdEventDate: any, createdEventWeights?: Array<{ __typename?: 'weightsForUserCreatedEvents', weight?: number | null, filled?: Array<boolean> | null }> | null }> | null } | null };

export type EventByIdQueryVariables = Exact<{
  id: Scalars['mongoId'];
}>;


export type EventByIdQuery = { __typename?: 'Query', eventById?: { __typename?: 'Event', _id?: any | null, name: string, description: string, date: any, cost?: string | null, createdBy: any, link?: string | null, location: { __typename?: 'Location', coordinates: Array<number> }, eventApplicants?: Array<{ __typename?: 'applicant', name: string, userId: any, weight: number }> | null, weights?: Array<{ __typename?: 'weightsForEvent', weight?: number | null, spotsAvailable?: Array<{ __typename?: 'spotsAvailableForEvent', name?: string | null, userId?: any | null }> | null }> | null } | null };

export type AcceptApplicantMutationVariables = Exact<{
  input: MutationAcceptApplicantInput;
}>;


export type AcceptApplicantMutation = { __typename?: 'Mutation', acceptApplicant?: boolean | null };

export type DeleteEventInEditCreatedEventMutationVariables = Exact<{
  id: Scalars['mongoId'];
}>;


export type DeleteEventInEditCreatedEventMutation = { __typename?: 'Mutation', deleteEvent?: boolean | null };

export type UserByIdProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type UserByIdProfileQuery = { __typename?: 'Query', userById?: { __typename?: 'User', name?: string | null, email: string, availableWeights?: Array<number> | null, createdEvents?: Array<{ __typename?: 'createdEvents', createdEventId: any, eventName: string, createdEventDescription: string, createdEventDate: any, createdEventWeights?: Array<{ __typename?: 'weightsForUserCreatedEvents', weight?: number | null, filled?: Array<boolean> | null }> | null }> | null, signedUpEvents?: Array<{ __typename?: 'userSignedUpEvents', accepted: boolean, eventName: string, signedUpEventDate: any, signedUpEventId: any }> | null } | null };

export type UserByIdSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserByIdSettingsQuery = { __typename?: 'Query', userById?: { __typename?: 'User', name?: string | null, email: string, availableWeights?: Array<number> | null } | null };

export type UpdateUserSettingsMutationVariables = Exact<{
  input: MutationUpdateUserSettingsInput;
}>;


export type UpdateUserSettingsMutation = { __typename?: 'Mutation', updateUserSettings?: { __typename?: 'User', name?: string | null, email: string, availableWeights?: Array<number> | null } | null };


export const CreateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MutationCreateEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"link"}}]}}]}}]} as unknown as DocumentNode<CreateEventMutation, CreateEventMutationVariables>;
export const EventsByLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventsByLocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<EventsByLocationQuery, EventsByLocationQueryVariables>;
export const GetEventsByDistanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventsByDistance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coordinates"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventsByDistance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"coordinates"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coordinates"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coordinates"}}]}}]}}]}}]} as unknown as DocumentNode<GetEventsByDistanceQuery, GetEventsByDistanceQueryVariables>;
export const EventsByWeightAndLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventsByWeightAndLocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<EventsByWeightAndLocationQuery, EventsByWeightAndLocationQueryVariables>;
export const GetEventsByWeightDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventsByWeight"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"weight"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"plusOrMinus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventsByWeight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"weight"},"value":{"kind":"Variable","name":{"kind":"Name","value":"weight"}}},{"kind":"Argument","name":{"kind":"Name","value":"plusOrMinus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"plusOrMinus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"weights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weight"}}]}}]}}]}}]} as unknown as DocumentNode<GetEventsByWeightQuery, GetEventsByWeightQueryVariables>;
export const EventsByWeightDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventsByWeight"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<EventsByWeightQuery, EventsByWeightQueryVariables>;
export const GetEventByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"mongoId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"weights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"spotsAvailable"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetEventByIdQuery, GetEventByIdQueryVariables>;
export const ApplyToEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApplyToEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MutationApplyToEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"applyToEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ApplyToEventsMutation, ApplyToEventsMutationVariables>;
export const UserByIdAppliedEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserByIdAppliedEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userById"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signedUpEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"eventName"}},{"kind":"Field","name":{"kind":"Name","value":"signedUpEventDate"}},{"kind":"Field","name":{"kind":"Name","value":"signedUpEventId"}}]}}]}}]}}]} as unknown as DocumentNode<UserByIdAppliedEventsQuery, UserByIdAppliedEventsQueryVariables>;
export const UserByIdCreatedEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserByIdCreatedEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userById"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdEventId"}},{"kind":"Field","name":{"kind":"Name","value":"eventName"}},{"kind":"Field","name":{"kind":"Name","value":"createdEventDescription"}},{"kind":"Field","name":{"kind":"Name","value":"createdEventDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdEventWeights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"filled"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UserByIdCreatedEventsQuery, UserByIdCreatedEventsQueryVariables>;
export const EventByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"mongoId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coordinates"}}]}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"eventApplicants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}}]}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"weights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"spotsAvailable"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]}}]}}]} as unknown as DocumentNode<EventByIdQuery, EventByIdQueryVariables>;
export const AcceptApplicantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptApplicant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MutationAcceptApplicantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptApplicant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<AcceptApplicantMutation, AcceptApplicantMutationVariables>;
export const DeleteEventInEditCreatedEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteEventInEditCreatedEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"mongoId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteEventInEditCreatedEventMutation, DeleteEventInEditCreatedEventMutationVariables>;
export const UserByIdProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserByIdProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userById"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"availableWeights"}},{"kind":"Field","name":{"kind":"Name","value":"createdEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdEventId"}},{"kind":"Field","name":{"kind":"Name","value":"eventName"}},{"kind":"Field","name":{"kind":"Name","value":"createdEventDescription"}},{"kind":"Field","name":{"kind":"Name","value":"createdEventDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdEventWeights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"filled"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"signedUpEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"eventName"}},{"kind":"Field","name":{"kind":"Name","value":"signedUpEventDate"}},{"kind":"Field","name":{"kind":"Name","value":"signedUpEventId"}}]}}]}}]}}]} as unknown as DocumentNode<UserByIdProfileQuery, UserByIdProfileQueryVariables>;
export const UserByIdSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserByIdSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userById"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"availableWeights"}}]}}]}}]} as unknown as DocumentNode<UserByIdSettingsQuery, UserByIdSettingsQueryVariables>;
export const UpdateUserSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MutationUpdateUserSettingsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"availableWeights"}}]}}]}}]} as unknown as DocumentNode<UpdateUserSettingsMutation, UpdateUserSettingsMutationVariables>;