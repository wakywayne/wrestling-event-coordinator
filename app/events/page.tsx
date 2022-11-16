'use client'

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

const EventPage: React.FC<Props> = () => {

    const { loading, error, data } = useQuery(GET_EVENTS);



    if (data) {
        return (
            <>
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
            </>
        )
    } else if (loading) {
        return (
            <>
                <LoadingEvents />
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

export default EventPage;