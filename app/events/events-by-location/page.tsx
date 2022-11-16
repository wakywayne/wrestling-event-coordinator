'use client'

import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import queries from '@/gql/queries';
import { Event as EventType } from '@/gql/index';
import LoadingEvents from '@/components/LoadingEvents';

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


const coordinates = [];



const EventsByLocation: React.FC<Props> = () => {

    const { loading, error, data } = useQuery(GET_EVENTS);
    const [rerunLocationPermissions, setRerunLocationPermissions] = useState(0);


    // get the user's coordinates
    const getCoordinates = (): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }


    useEffect(() => {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            console.log(result.state);
            if (result.state === 'granted') {
                getCoordinates().then((position) => {
                    coordinates.push(position.coords.longitude);
                    coordinates.push(position.coords.latitude);
                });
                // @ts-ignore
            }
            else if (result.state === 'prompt') {
                alert('Please allow location access to use this feature');
                getCoordinates().then((position) => {
                    coordinates.push(position.coords.longitude);
                    coordinates.push(position.coords.latitude);
                });
            } else if (result.state === 'denied') {
                // @todo display instructions for doing this and uncoment the button
                // alert('Please click the allow location button in the bottom right to use this feature, don\'t worry we don\'t store your location');
                alert('You didn\'t allow location access, please allow location access to use this feature');
            }
        });
    }, [rerunLocationPermissions]);

    // reset the users coordinates to the prompt state
    function revokePermission() {
        console.log(navigator.permissions)
        setRerunLocationPermissions(rerunLocationPermissions + 1);
    }

    if (data) {
        return (
            <>
                <h1 className="mt-2 text-3xl text-center">Events Near You</h1>
                <div className="grid grid-auto-fit">
                    {data.events.map((event: EventType) => (

                        <div key={`mainEvent${event._id}`} id={`${event._id}`} className="relative m-4 border-2 rounded-lg shadow-lg bg-gradient-to-br from-myGreen to-green-500 ">
                            <p className="m-2 text-lg font-semibold tracking-wider text-center text-white rounded-full font-poppins ">Title</p>
                            <div className="flex justify-center rounded-t-lg ">
                                <div className="w-11/12 p-2 mb-2 bg-white border-2 rounded-sm decoration-from-font ">
                                    <p className="my-1 text-sm">Location: </p>
                                    {/* @ts-ignore */}
                                    <p className="my-1 text-sm">Date: {event.date}</p>
                                    <p className="my-1 text-sm">Description: {event.description}</p>
                                </div>
                            </div>
                            {/* create a red button */}
                            <div className="flex justify-center mb-1">
                                <button name={`${event._id}`} className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-myRed to-red-400 hover:bg-red-800">View Event</button>
                            </div>
                        </div>

                    ))}
                </div>
                {/* <button onClick={() => revokePermission()} className="absolute bottom-0 left-0 p-2 m-4 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-myRed to-red-400 hover:bg-red-800">Allow Location</button> */}
            </>
        )
    } else if (loading) {
        return (
            <>
                <h1 className="mt-2 text-3xl text-center">Events Near You</h1>
                <LoadingEvents />
                {/* make a button that is absolutely poitioned in the bottom right */}

            </>
        )
    } else {
        return (
            <>
                <p>Sorry there seems to be an error getting the events, there might be no events for your criteria</p>
            </>
        )
    }
}

export default EventsByLocation;