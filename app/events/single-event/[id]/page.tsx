'use client'

import { useQuery, useMutation, gql } from '@apollo/client';
import { useState, useEffect } from 'react';
import { Event as EventType, weightsForEvent } from '@/gql/index';
import { useSession } from 'next-auth/react';

interface Props {
    params: {
        id: string;
    }
}

const GET_EVENT_BY_ID = gql`
query GetEventById($id: mongoId!){
  eventById(id:$id){
    _id
    name
    description
    cost
    date
    link
    weights{
      weight
      spotsAvailable{
        userId
      }
    }
  }
}
`;

const APPLY_FOR_WEIGHT = gql`
mutation ApplyToEvents($input: MutationApplyToEventInput!){
  applyToEvent(input:$input)
}
`;

const SingleEventPage: React.FC<Props> = ({ params }) => {

    const { data: session } = useSession();


    const [applyForWeight, setApplyForWeight] = useState<number | undefined | "default">("default")
    const [completed, setCompleted] = useState<boolean>(false);


    const { data, loading, error } = useQuery(GET_EVENT_BY_ID, {
        variables: {
            id: params.id
        }
    });

    const [applyToEvent, { loading: mutationLoading, error: mutationError }] = useMutation(APPLY_FOR_WEIGHT, {
        onCompleted: (data) => {
            setCompleted(true)
        }
    });

    function applyForWeightClick(weight: number) {

        console.log({ data })

        let input = {
            eventDate: data.eventById.date,
            eventId: params.id,
            eventName: data.eventById.name,
            name: session?.user.name ? session?.user.name : false,
            weight: weight
        }

        if (!weight) {
            return;
        }
        else if (!session?.user.name) {
            alert("You have not set up a name for your profile. Please do so in your profile settings.")
            setApplyForWeight("default")
            return;
        }
        else if (confirm(`Are you sure you want to apply for the ${weight} weight?`)) {
            setApplyForWeight(weight)
            applyToEvent({ variables: { input } })
        } else {
            setApplyForWeight("default")
        }
    }

    if (data?.eventById) {
        const event: EventType = data.eventById;

        return (
            // <div className='relative w-screen h-screen bg-gradient-to-b from-transparent to-green-300'>
            // @todo make this get the results passed down as props using layout I want this text to display right away this should be a server side render
            <div>
                <h1 className='text-4xl font-bold text-center mt-7'>{event.name} Event</h1>
                <div className='p-2 rounded pattern'>
                    <div className='flex flex-col items-center justify-center mt-6'>

                        {/*display the weights for the event */}
                        <div className='flex flex-col items-center justify-center '>
                            {/* <h1 className='text-2xl '>Available Weights</h1> */}
                            {!mutationLoading && <select value={applyForWeight} className="w-full p-2 mb-4 text-sm font-semibold text-black bg-gray-400 rounded-sm" onChange={(e) => applyForWeightClick(Number(e.target.value))}>
                                {/* @todo we should have a separate function with a confirm option that determines if the application will go through*/}
                                <option value={"default"}>Apply for a weight</option>

                                {
                                    (Array.isArray(data.eventById?.weights) && data.eventById?.weights.length > 0 && event.weights) ?
                                        event.weights.map((weightObject: weightsForEvent) => {

                                            return (
                                                weightObject.weight && <option key={`weight${weightObject.weight}`} value={weightObject.weight}>{weightObject.weight}</option>
                                            )
                                        }) : <option value={undefined}>This event accepts all weights</option>
                                }

                            </select>}
                            {mutationLoading && <p>Applying for weight...</p>}
                            {mutationError && <p>Error Applying for event please try again</p>}
                        </div>
                        <p className='my-1 text-xl'>Info: {event.description}</p>
                        {event.date && <p className='my-1 text-xl'>Date: {String(event.date)}</p>}
                        {event.cost && <p className='my-1 text-xl'>Cost: {event.cost}</p>}
                        {event.link && < a href={`${event.link}`} className='my-1 text-xl underline text-myLightBlue'>More Info</a>}
                    </div>
                </div>
            </div>
        )
    } else if (loading) {
        return (
            <div className='relative h-screen '>
                <div className="flex items-center justify-center mt-8 space-x-2">
                    <div role="status">
                        <svg className="inline w-8 h-8 mr-2 text-gray-200 animate-spin fill-myRed" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className='h-screen '>
                <div>
                    <p className='text-4xl font-bold text-center'>Single Event Page</p>
                    <p className='text-2xl font-bold text-center'>Error</p>
                </div>
            </div>
        )
    }
}

export default SingleEventPage;