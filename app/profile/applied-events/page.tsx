'use client';

import LoadingEvents from '@/components/LoadingEvents';
import { useQuery } from '@apollo/client';
import { gql } from '@/src/__generated__';
import Link from 'next/link';

const USER_QUERY = gql(`
query UserByIdAppliedEvents {
      userById{
            signedUpEvents {
                accepted
                eventName
                signedUpEventDate
                signedUpEventId
        }
        }
    }
`);

interface Props {

}


const AppliedEventsComponentPainInMy: React.FC<Props> = () => {

    const { loading, error, data } = useQuery(USER_QUERY);

    console.log({ data })

    if (loading) return <LoadingEvents />;
    if (error) return <p>Error :(</p>;

    if (data?.userById?.signedUpEvents) {
        return (
            <>
                <h1 className="text-3xl font-bold text-center">Applied Events</h1>
                <div className="grid grid-auto-fit">
                    {data.userById.signedUpEvents.map((event: any) => {
                        return (
                            <div key={`mainEvent${event.signedUpEventId}`} id={`${event.signedUpEventId}`} className="relative m-4 border-2 rounded-lg shadow-lg bg-gradient-to-tl from-slate-400 to-slate-300 ">
                                <p className="m-2 text-lg font-semibold tracking-wider text-center text-white rounded-full font-poppins ">{event.eventName}</p>
                                <div className="flex justify-center rounded-t-lg ">
                                    <div className="w-11/12 p-2 mb-2 bg-white border-2 rounded-sm decoration-from-font ">
                                        <p className="my-1 text-sm">Description: {event.eventName}</p>
                                        <p className="my-1 text-sm">Date: {event.signedUpEventDate}</p>
                                    </div>
                                </div>
                                {/* create a red button */}
                                <Link href={`events/single-event/${event.signedUpEventId}`} className="flex justify-center mb-1">
                                    <button name={`EventButtonFor:${event.signedUpEventId}`} className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-myRed to-red-400 ">View Event</button>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </>
        )
    } else {
        return (
            <div className="flex justify-center">
                <h1 className="text-3xl font-bold text-center">No Events Applied</h1>
            </div>
        )
    }
}

export default AppliedEventsComponentPainInMy;
