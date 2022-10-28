import { ObjectId } from 'bson';

// interfaces for Users
interface weightsForUserCreatedEvents {
    weight: string;
    filled: boolean[];
}

// export interface createdEvents {
//     _id: ObjectId;
//     eventName: string;
//     eventDate: Date;
//     eventDescription: string;
//     cost?: string;
//     eventLink?: string;
//     weights?: weightsForUserCreatedEvents[];
// }

export class createdEvents {
    _id: ObjectId;
    eventName: string;
    eventDate: Date;
    eventDescription: string;
    cost?: string;
    eventLink?: string;
    weights?: weightsForUserCreatedEvents[];

    constructor(_id: ObjectId, eventName: string, eventDate: Date, eventDescription: string, cost?: string, eventLink?: string, weights?: weightsForUserCreatedEvents[]) {
        this._id = _id;
        this.eventName = eventName;
        this.eventDate = eventDate;
        this.eventDescription = eventDescription;
        this.cost = cost;
        this.eventLink = eventLink;
        this.weights = weights;
    }
}

// interface userSignUp {
//     eventId: ObjectId;
//     eventName: string;
//     eventDate: Date;
//     accepted: boolean;
// }

export class userSignUp {
    eventId: ObjectId;
    eventName: string;
    eventDate: Date;
    accepted: boolean;


    constructor(eventId: ObjectId, eventName: string, eventDate: Date, accepted: boolean) {
        this.eventId = eventId;
        this.eventName = eventName;
        this.eventDate = eventDate;
        this.accepted = accepted;
    }
}

export class User {
    _id: ObjectId;
    name: string;
    email: string;
    password?: string;
    availableWeights?: number[];
    createdEvents?: createdEvents[];
    signedUpEvents?: userSignUp[];



    constructor(id: ObjectId, name: string, email: string, password?: string, availableWeights?: number[],
        createdEvents?: createdEvents[], signedUpEvents?: userSignUp[]) {
        this._id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.availableWeights = availableWeights;
        this.createdEvents = createdEvents;
        this.signedUpEvents = signedUpEvents;
    }
}

// interfaces for Events

interface spotsAvailableForEvent {
    _id: ObjectId;
    name: string;
}

type spotsAvailableType = null | string | spotsAvailableForEvent

interface weightsForEvent {
    weight: number;
    spotsAvailable: spotsAvailableType[] | Array<null>;
}

export class Event {
    name: string;
    date: Date;
    description: string;
    cost?: string;
    eventLink?: string;
    weights?: weightsForEvent[];

    constructor(name: string, date: Date, description: string, cost?: string, eventLink?: string, weights?: weightsForEvent[]) {
        this.name = name;
        this.date = date;
        this.description = description;
        this.cost = cost;
        this.eventLink = eventLink;
        this.weights = weights;
    }

}

