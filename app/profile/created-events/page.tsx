'use client';
import LoadingEvents from '@/components/LoadingEvents';
import { useQuery } from '@apollo/client';
import { gql } from '@/src/__generated__';
import Link from 'next/link';

const USER_QUERY = gql(`
query UserByIdCreatedEvents {
      userById{
            createdEvents {
                createdEventId
                eventName
                createdEventDescription
                createdEventDate
                createdEventWeights{
                    weight
                    filled
                }
            }
        }
    }
    
`);

interface Props {

}

const CreatedEvents: React.FC<Props> = () => {


    const { loading, error, data } = useQuery(USER_QUERY);

    if (loading) return <LoadingEvents grey={true} />


    if (data?.userById?.createdEvents) {
        return (
            <>
                <h1 className="text-3xl font-bold text-center">Created Events</h1>
                <div className="grid grid-auto-fit">
                    {data.userById.createdEvents.map((event: any) => {
                        return (
                            <div key={`mainEvent${event.createdEventId}`} id={`${event.createdEventId}`} className="relative m-4 border-2 rounded-lg shadow-lg bg-gradient-to-tl from-slate-400 to-slate-300 ">
                                <p className="m-2 text-lg font-semibold tracking-wider text-center text-white rounded-full font-poppins ">{event.eventName}</p>
                                <div className="flex justify-center rounded-t-lg ">
                                    <div className="w-11/12 p-2 mb-2 bg-white border-2 rounded-sm decoration-from-font ">
                                        <p className="my-1 text-sm">Description: {event.eventName}</p>
                                        <p className="my-1 text-sm">Date: {event.createdEventDate}</p>
                                    </div>
                                </div>
                                {/* create a red button */}
                                <Link href={`profile/edit-created-event/${event.createdEventId}`} className="flex justify-center mb-1">
                                    <button name={`EventButtonFor:${event.createdEventId}`} className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-myRed to-red-400 ">View Event</button>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </>
        );
    }

    else {
        return <p>Error :(</p>;
    }
};



export default CreatedEvents;