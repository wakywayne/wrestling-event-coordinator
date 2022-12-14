'use client'

import { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { gql } from '@/src/__generated__';
import { Event as EventType } from '@/gql/index';
// import LoadingEvents from '@/components/LoadingEvents';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Props {

}

const GET_EVENTS = gql(`
    query EventsByWeightAndLocation {
    events {
    _id 
    createdBy
    name
    date
    description
        }
    }
`);

const GET_EVENTS_BY_WEIGHT = gql(`
query GetEventsByWeight($weight: Int!, $plusOrMinus:Int){
eventsByWeight(weight:$weight, plusOrMinus:$plusOrMinus){
    _id 
    createdBy
    name
    date
    description
  weights{
    weight
  }
}
}
`);

const GET_EVENTS_BY_DISTANCE = gql(`
query GetEventsByDistance($coordinates: [Float!]!){
eventsByDistance(coordinates:$coordinates){
    _id
    createdBy
    name
    date
    description
    location{
        coordinates
    }
}
}
`);



const EventsByLocationAndWeight: React.FC<Props> = () => {

    const [rerunLocationPermissions, setRerunLocationPermissions] = useState(0);
    const [coordinates, setCoordinates] = useState<number[] | undefined>(undefined);
    const [weight, setWeight] = useState<undefined | number>(undefined);
    const [eventsSortedByCoordinates, setEventsSortedByCoordinates] = useState<EventType[] | undefined>(undefined);
    const [finalEvents, setFinalEvents] = useState<EventType[] | undefined>(undefined);


    const { data: session } = useSession();

    const { loading, error, data } = useQuery(GET_EVENTS);

    const [getEventsByWeight,] = useLazyQuery(GET_EVENTS_BY_WEIGHT, {
        onCompleted: (data) => {
            filterByWeightsFunction(data.eventsByWeight as EventType[]);
        }
    });

    const [getEventsByLocation, { loading: lazyLoading }] = useLazyQuery(GET_EVENTS_BY_DISTANCE, {
        onCompleted: (data) => {
            setEventsSortedByCoordinates(data.eventsByDistance as EventType[]);
        }
    });


    // get the user's coordinates
    const getCoordinates = (): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    const filterByWeightsFunction = (events: EventType[]) => {
        if (eventsSortedByCoordinates) {
            const finalEvents = eventsSortedByCoordinates.filter((event: EventType) => events.find(e => e._id === event._id))
            setFinalEvents(finalEvents)
        } else if (!eventsSortedByCoordinates && data?.events) {
            const finalEvents: Array<Partial<EventType>> = data.events.filter((event: Partial<EventType>) => events.find(e => e._id === event._id))
            // Same problem as other file where we were getting a location error and had to use partial
            // @ts-ignore
            setFinalEvents(finalEvents)
        }

    }




    useEffect(() => {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            if (result.state === 'granted') {
                getCoordinates().then((position) => {
                    const longitude = position.coords.longitude;
                    const latitude = position.coords.latitude;
                    const coords = [longitude, latitude]
                    setCoordinates(coords);
                    getEventsByLocation({ variables: { coordinates: coords } });
                });
            }
            else if (result.state === 'prompt') {
                alert('Please allow location access to use this feature');
                getCoordinates().then((position) => {
                    const longitude = position.coords.longitude;
                    const latitude = position.coords.latitude;
                    const coords = [longitude, latitude]
                    setCoordinates(coords);
                    getEventsByLocation({ variables: { coordinates: coords } });
                });
            } else if (result.state === 'denied') {
                // @todo display instructions for doing this and uncoment the button
                // alert('Please click the allow location button in the bottom right to use this feature, don\'t worry we don\'t store your location');
                alert('You didn\'t allow location access, please allow location access to use this feature');
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rerunLocationPermissions]);


    const getEventsByWeightOnChange = (weight: number | undefined, plusOrMinus?: number,) => {
        if (weight) {
            getEventsByWeight({ variables: { plusOrMinus, weight } })
        } else {
            alert('Please select a weight')
        }
    }


    if (eventsSortedByCoordinates && !finalEvents) {
        return (
            <>
                <h2 className="my-6 text-3xl font-bold text-center">Events Closest to You With Weight Filter</h2>
                <div className="flex justify-around">
                    {/* create a select input with two options */}
                    <select className="w-1/2 p-2 my-2 text-sm font-semibold text-black bg-gray-400 rounded-sm" onChange={(e) => setWeight(parseInt(e.target.value))}>
                        session?.user?.availableWeights ? <option value={undefined}>Select a weight</option> :null
                        {
                            session?.user?.availableWeights ? session.user.availableWeights.map((weight: number) => (
                                <option key={`weight${weight}`} value={weight}>{weight}</option>
                            )) : <option value={undefined}>You need to be logged in to use this feature</option>

                        }
                    </select>
                    <button onClick={() => getEventsByWeightOnChange(weight, undefined)} className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-myRed to-red-400 hover:bg-red-800">Search By Weight</button>
                </div>
                <div className="grid grid-auto-fit">
                    {eventsSortedByCoordinates.map((event: EventType) => (

                        <div key={`mainEventSortedByLocation${event._id}`} id={`${event._id}`} className="relative m-4 border-2 rounded-lg shadow-lg bg-gradient-to-br from-myGreen to-green-500 ">
                            <p className="m-2 text-lg font-semibold tracking-wider text-center text-white rounded-full font-poppins ">{event.name}</p>
                            <div className="flex justify-center rounded-t-lg ">
                                <div className="w-11/12 p-2 mb-2 bg-white border-2 rounded-sm decoration-from-font ">
                                    <p className="my-1 text-2xl lg:text-sm">Location: </p>
                                    {/* @ts-ignore */}
                                    <p className="my-1 text-2xl lg:text-sm">Date: {event.date}</p>
                                    <p className="my-1 text-2xl lg:text-sm">Description: {event.description}</p>
                                </div>
                            </div>
                            {/* create a red button */}
                            <Link href={`events/single-event/${event._id}`} className="flex justify-center mb-1">
                                <button name={`EventButtonFor:${event._id}`} className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-myRed to-red-400 hover:bg-red-800">View Event</button>
                            </Link>
                        </div>

                    ))}
                </div>
                {/* <button onClick={() => revokePermission()} className="absolute bottom-0 left-0 p-2 m-4 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-myRed to-red-400 hover:bg-red-800">Allow Location</button> */}
            </>
        )
    } else if (finalEvents) {
        return (
            <>
                <h1 className="my-6 text-3xl font-bold text-center">Events Closest to You With Weight Filter</h1>
                <div className="flex justify-around">
                    {/* create a select input with two options */}
                    <select className="w-1/2 p-2 my-2 text-sm font-semibold text-black bg-gray-400 rounded-sm" onChange={(e) => setWeight(parseInt(e.target.value))}>
                        session?.user?.availableWeights ? <option value={undefined}>Select a weight</option> :null
                        {
                            session?.user?.availableWeights ? session.user.availableWeights.map((weight: number) => (
                                <option key={`weight${weight}`} value={weight}>{weight}</option>
                            )) : <option value={undefined}>You need to be logged in to use this feature</option>

                        }
                    </select>
                    <button onClick={() => getEventsByWeightOnChange(weight, undefined)} className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-myRed to-red-400 hover:bg-red-800">Get Events By Weight</button>
                </div>
                <div className="grid grid-auto-fit">
                    {finalEvents.map((event: EventType) => (

                        <div key={`mainEventSortedByLocation${event._id}`} id={`${event._id}`} className="relative m-4 border-2 rounded-lg shadow-lg bg-gradient-to-br from-myGreen to-green-500 ">
                            <p className="m-2 text-lg font-semibold tracking-wider text-center text-white rounded-full font-poppins ">{event.name}</p>
                            <div className="flex justify-center rounded-t-lg ">
                                <div className="w-11/12 p-2 mb-2 bg-white border-2 rounded-sm decoration-from-font ">
                                    <p className="my-1 text-sm">Location: </p>
                                    {/* @ts-ignore */}
                                    <p className="my-1 text-sm">Date: {event.date}</p>
                                    <p className="my-1 text-sm">Description: {event.description}</p>
                                </div>
                            </div>
                            {/* create a red button */}
                            <Link href={`events/single-event/${event._id}`} className="flex justify-center mb-1">
                                <button name={`EventButtonFor:${event._id}`} className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-myRed to-red-400 hover:bg-red-800">View Event</button>
                            </Link>
                        </div>

                    ))}
                </div>
                {/* <button onClick={() => revokePermission()} className="absolute bottom-0 left-0 p-2 m-4 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-myRed to-red-400 hover:bg-red-800">Allow Location</button> */}
            </>)
    }
    // else if (loading || lazyLoading) {
    //     return (
    //         <>
    //             <h1 className="mt-6 text-4xl font-bold text-center">Events Closest to You</h1>
    //             <LoadingEvents />
    //             {/* make a button that is absolutely positioned in the bottom right */}

    //         </>
    //     )
    // }
    else if (!coordinates) {
        return (
            <>
                <p>You did not give us location permissions you won&apos;t be able to use this feature. <strong>Go to the View Events With Your Weight Available Option</strong></p>

            </>
        )
    } else {
        return (
            <>
                <p>There was an error getting the events</p>
            </>
        )
    }
}


export default EventsByLocationAndWeight;