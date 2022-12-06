'use client'

import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@/src/__generated__';
import { useState, useEffect } from 'react';
import { Event as EventType, weightsForEvent } from '@/gql/index';
import { useSession } from 'next-auth/react';

interface Props {
    params: {
        id: string;
    }
}

const GET_EVENT_BY_ID = gql(`
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
`);

const APPLY_FOR_WEIGHT = gql(`
mutation ApplyToEvents($input: MutationApplyToEventInput!){
  applyToEvent(input:$input)
}
`);

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

        if (data?.eventById) {

            let input = {
                eventDate: data.eventById.date,
                eventId: params.id,
                eventName: data.eventById.name,
                name: session?.user.name ? session?.user.name : "you need to log in",
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
        } else {
            alert("Event did not have id")
            // @todo in the future you should have an error collection in the database
            // This will allow you to better handle errors in production
        }
    }

    if (data?.eventById) {
        // @ts-ignore unfortunately I started getting the graphql types into the frontend a little too late
        const event: Omit<EventType, "location" | "createdBy"> = data.eventById;

        return (
            // <div className='relative w-screen myContainer bg-gradient-to-b from-transparent to-green-300'>
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
    } else {
        return (
            <div className='myContainer '>
                <div>
                    <p className='text-4xl font-bold text-center'>Single Event Page</p>
                    <p className='text-2xl font-bold text-center'>Error</p>
                </div>
            </div>
        )
    }
}

export default SingleEventPage;