import { ObjectId } from 'bson';


export class weightsForUserCreatedEvents {
    weight?: string;
    filled?: boolean[];


    constructor(weight?: string, filled?: boolean[]) {
        this.weight = weight;
        this.filled = filled;
    }
}



// @todo change these to start with created event in the database
export class createdEvents {
    createdEventId: ObjectId;
    createdEventName: string;
    createdEventDate: Date;
    createdEventDescription: string;
    createdEventCost?: string;
    createdEventLink?: string;
    createdEventWeights?: weightsForUserCreatedEvents[];


    constructor(createdEventId: ObjectId, createdEventName: string, createdEventDate: Date, createdEventDescription: string,
        createdEventCost?: string, createdEventLink?: string,
        createdEventWeights?: weightsForUserCreatedEvents[]) {

        this.createdEventId = createdEventId;
        this.createdEventName = createdEventName;
        this.createdEventDate = createdEventDate;
        this.createdEventDescription = createdEventDescription;
        this.createdEventCost = createdEventCost;
        this.createdEventLink = createdEventLink;
        this.createdEventWeights = createdEventWeights;
    }

}



export class userSignedUpEvents {
    eventId: ObjectId;
    // eventId: string;
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
    // _id: string;
    name?: string;
    email: string;
    availableWeights?: number[];
    createdEvents?: createdEvents[];
    signedUpEvents?: userSignedUpEvents[];



    constructor(email: string, id: ObjectId, name?: string, availableWeights?: number[],
        createdEvents?: createdEvents[], signedUpEvents?: userSignedUpEvents[]) {
        this._id = id;
        this.name = name;
        this.email = email;
        this.availableWeights = availableWeights;
        this.createdEvents = createdEvents;
        this.signedUpEvents = signedUpEvents;
    }
}



export class spotsAvailableForEvent {
    userId: ObjectId;
    // userId: string;
    name: string;


    constructor(userId: ObjectId, name: string) {
        this.userId = userId;
        this.name = name;
    }
}


export class applicant extends spotsAvailableForEvent {
    weight: number;


    constructor(weight: number, userId: ObjectId, name: string) {
        super(userId, name);
        this.weight = weight;
    }
}


export class weightsForEvent {
    weight: number;
    // spotsAvailable: spotsAvailableForEvent[];
    spotsAvailable: spotsAvailableForEvent[];

    constructor(weight: number, spotsAvailable: spotsAvailableForEvent[]) {
        this.weight = weight;
        this.spotsAvailable = spotsAvailable;
    }
}

// @todo you need to add an application section to the event object so we can notify a user if they have been accepted or not
// we can set an object to local storage that has an array of events that they have been accepted to 
// we can then map through that array and only display the events that and make sure there aren't any new events that 
// they have been accepted to



export class Event {
    _id: ObjectId;
    createdBy: ObjectId;
    location: number[];
    name: string;
    date: Date;
    description: string;
    cost?: string;
    link?: string;
    weights?: weightsForEvent[];
    eventApplicants?: applicant[] | undefined;

    constructor(createdBy: ObjectId, location: number[], name: string, date: Date, description: string, _id: ObjectId, cost?: string, link?: string,
        weights?: weightsForEvent[], eventApplicants?: applicant[] | undefined) {
        this.createdBy = createdBy;
        this._id = _id;
        this.location = location;
        this.name = name;
        this.date = date;
        this.description = description;
        this.cost = cost;
        this.link = link;
        this.weights = weights;
        this.eventApplicants = eventApplicants;
    }

}

