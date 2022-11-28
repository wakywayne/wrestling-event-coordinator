'use client'

import { useState, useEffect } from 'react';
import { useQuery, useLazyQuery, gql } from '@apollo/client';
import { Event as EventType } from '@/gql/index';
import LoadingEvents from '@/components/LoadingEvents';
import Link from 'next/link';

interface Props {

}

const GET_EVENTS = gql`
    query {
    events {
    _id 
    createdBy
    name
    date
    description
        }
    }
`;

const GET_EVENTS_BY_DISTANCE = gql`
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
`;



const EventsByLocation: React.FC<Props> = () => {

    const [rerunLocationPermissions, setRerunLocationPermissions] = useState(0);
    const [coordinates, setCoordinates] = useState<number[] | undefined>(undefined);
    const [eventsSortedByCoordinates, setEventsSortedByCoordinates] = useState<EventType[] | undefined>(undefined);

    const { loading, error, data } = useQuery(GET_EVENTS);
    const [getEventsByLocation, { loading: lazyLoading }] = useLazyQuery(GET_EVENTS_BY_DISTANCE, {
        onCompleted: (data) => {
            setEventsSortedByCoordinates(data.eventsByDistance)
        }
    });
    // get the user's coordinates
    const getCoordinates = (): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
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

    // reset the users coordinates to the prompt state
    // function revokePermission() {
    //     console.log(navigator.permissions)
    //     setRerunLocationPermissions(rerunLocationPermissions + 1);
    // }

    if (eventsSortedByCoordinates) {
        return (
            <>
                <h1 className="mt-2 text-4xl font-bold text-center">Events Closest to You</h1>
                <div className="grid grid-auto-fit">
                    {eventsSortedByCoordinates.map((event: EventType) => (

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
            </>
        )
    } else if (loading || lazyLoading) {
        return (
            <>
                <h1 className="mt-2 text-4xl font-bold text-center">Events Closest to You</h1>
                <LoadingEvents />
                {/* make a button that is absolutely positioned in the bottom right */}

            </>
        )
    } else if (!coordinates) {
        return (
            <>
                <p>You did not give us location permissions you won&apos;t be able to use this feature. <strong>We are currently displaying all events</strong></p>
                <h1 className="mt-2 text-4xl font-bold text-center">All Events</h1>
                <div className="grid grid-auto-fit">
                    {data.events.map((event: EventType) => (

                        <div key={`mainEventWhenNoLocationGiven${event._id}`} id={`${event._id}`} className="relative m-4 border-2 rounded-lg shadow-lg bg-gradient-to-br from-myGreen to-green-500 ">
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

export default EventsByLocation;