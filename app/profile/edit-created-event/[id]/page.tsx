'use client'

import { AiOutlineCheck } from 'react-icons/ai'
import { FiX } from 'react-icons/fi'
import { useQuery } from '@apollo/client';
import { gql } from '@/src/__generated__/gql';
import { BsPencilSquare } from 'react-icons/bs';
import RadioButton from '@/components/RadioButton';

interface Props {
    params: {
        id: string;
    };
}

const CREATED_EVENT_QUERY = gql(`
    query EventById($id: mongoId!) {
        eventById(id: $id) {
            _id
            name
            description
            location{
              coordinates
            }
            date
        	eventApplicants{
            name
            userId
            weight
          }
        link
        weights{
          weight
          spotsAvailable{
            name
            userId
          }
        }
        }
    }
            `);

const CreatedEventEdit: React.FC<Props> = ({ params }) => {

    const { loading, error, data } = useQuery(CREATED_EVENT_QUERY, {
        variables: {
            id: params.id
        }
    });



    if (loading) return (
        <div className='relative myContainer '>
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
    if (error) return <p>Error :(</p>;

    if (data?.eventById) {
        let applicantsExist = data.eventById.eventApplicants?.length;
        let weightsExist = data.eventById.weights?.length;

        return (
            <div className='relative '>
                <h1 className='text-4xl font-bold text-center mt-7'>{data.eventById.name} Event</h1>
                <div className='p-2 rounded pattern'>
                    <div className='flex flex-col items-center justify-center mt-6'>

                        {/*display the weights for the event */}
                        <div className='flex flex-col items-center justify-center '>
                            <p className='my-1 text-xl '>{data.eventById.date}</p>
                            <a href={`${data.eventById.link}`} target="_blank" className='my-1 text-xl underline text-myLightBlue' rel="noreferrer">Event Link</a>
                            <div className="flex items-center">
                                <p className='my-1 mr-1 text-xl'>Has Applicants: </p>
                                {applicantsExist ? <AiOutlineCheck /> : <FiX />}
                            </div>
                            <div className="flex flex-col items-center w-full ">
                                <h6 className='mx-auto text-xl '>Weight Spots</h6>
                                {/* @ts-ignore we are good here*/}
                                {data?.eventById?.weights ? data.eventById.weights.map((weight: any, index: number) => {
                                    return (
                                        <div key={`dataEventsByIdWeights ${index}`} className='flex flex-wrap items-center justify-start w-full px-2 my-2 bg-white border-2 border-black border-solid rounded-full'>
                                            <p className='my-1 mr-1 text-xl'>{weight.weight}<sub>lbs</sub>:</p>
                                            {weight.spotsAvailable.map((spot: any, index: number) => {
                                                // return spot.userId !== "empty" ? <input type='radio' className='my-1 mr-1 text-xl' checked /> : <input type='radio' className='my-1 mr-1 text-xl' />
                                                return spot.userId !== "empty" ? <RadioButton checked={true} /> : <RadioButton checked={false} />
                                            })}
                                        </div>
                                    )
                                }) : <p className='my-1 text-xl'>No weights added</p>}
                            </div>
                            {/* @ts-ignore not sure about this one... */}
                            {data?.eventById?.weights ? <p className='my-1 text-xl '>{data.eventById.weights.weight}</p> : <p className='my-1 text-xl'>No weights added</p>}
                            <p className='my-1 text-xl '>{data.eventById.description}</p>
                            {/* <p>{data.eventById.weights.spotsAvailable.name}</p> */}
                            {/* <p>{data.eventById.weights.spotsAvailable.userId}</p> */}
                        </div>

                        {/* make a small button */}
                    </div>
                </div>
                <button className='absolute top-0 flex p-2 text-xs text-white rounded-lg bg-myRed hover:bg-red-700 right-3 hover:cursor-pointer myFocus:ring-4 ring-red-300'><span className='mr-1 '>Edit</span> <BsPencilSquare /></button>
            </div>
        )
    } else {
        return <p>Event not found</p>
    }
}

export default CreatedEventEdit;