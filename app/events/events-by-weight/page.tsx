'use client'

import { useState, useEffect } from 'react';
import { useQuery, useLazyQuery, gql } from '@apollo/client';
import { Event as EventType } from '@/gql/index';
import { useSession } from 'next-auth/react';
import LoadingEvents from '@/components/LoadingEvents';
import Link from 'next/link';

interface Props {

}


const GET_EVENTS_BY_WEIGHT = gql`
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
`;

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



const EventsByWeights: React.FC<Props> = () => {

    const [events, setEvents] = useState<EventType[] | never[]>([]);
    const [weight, setWeight] = useState<number | undefined>(undefined);

    // get the current session
    const { data: session } = useSession();

    // Get all events from cache
    const { loading, error, data } = useQuery(GET_EVENTS);

    // we use lazy query so we can call this in the function
    const [getEventsByWeight,] = useLazyQuery(GET_EVENTS_BY_WEIGHT, {
        onCompleted: (data) => {
            setEvents(data.eventsByWeight)
        }
    });




    useEffect(() => {
        if (data) {
            setEvents(data.events)
        } else {
            return
        }
    }, [data])


    const getEventsByWeightOnChange = (weight: number | undefined, plusOrMinus?: number,) => {
        if (weight) {
            getEventsByWeight({ variables: { plusOrMinus, weight } })
        } else {
            alert('Please select a weight')
        }
    }


    if (!events && loading) {
        return (
            <>
                <h1 className="mt-2 text-4xl font-bold text-center">Events By Weight</h1>
                <LoadingEvents />
            </>
        )
    } else if (error) {
        return (
            <>
                <h1 className="mt-2 text-4xl font-bold text-center">Sorry there was an error loading events please click on events in the navigation menu</h1>

            </>
        )
    } else {
        return (
            <>
                <h1 className="mt-2 text-4xl font-bold text-center">Events By Weight</h1>
                {/* button */}
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
                    {events.map((event: EventType) => (

                        <div key={`mainEventByWeight${event._id}`} id={`${event._id}`} className="relative m-4 border-2 rounded-lg shadow-lg bg-gradient-to-br from-myGreen to-green-500 ">
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
                            <Link href={`events/single-event/${event._id}`} className="flex justify-center mb-1">
                                <button name={`EventButtonFor:${event._id}`} className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-myRed to-red-400 hover:bg-red-800">View Event</button>
                            </Link>
                        </div>

                    ))}
                </div>
            </>
        )
    }
}


export default EventsByWeights;