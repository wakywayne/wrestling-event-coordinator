'use client'

import { useMutation } from "@apollo/client";
import { gql } from "@/src/__generated__";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiFillInfoCircle } from 'react-icons/ai'
import { BsX } from 'react-icons/bs'
import { z } from "zod";
import { cleanUndefinedOrNullKeys } from '@/utils/index'

interface Props {

}

interface EventType {
    cost?: string;
    date: string;
    description: string;
    latitude: number;
    longitude: number;
    link?: string;
    weights?: number[];
    name: string;
}

const CREATE_EVENT = gql(`
mutation CreateEvent($input: MutationCreateEventInput!){
  createEvent(input:$input){
        _id
        name
        description
        cost
        date
        link
    }
}
`);


const CreateEvent: React.FC<Props> = () => {


    const schema = z.object({
        name: z.string().min(1).max(100),
        description: z.string().min(1).max(1000),
        cost: z.string().min(1).max(100).optional(),
        date: z.string().min(1).max(100),
        link: z.string().min(1).max(100).optional(),
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        weights: z.array(z.number()).min(1).max(350).optional()
    });


    const defaultValues = {
        name: "",
        description: "",
        cost: "",
        date: "",
        link: "",
        latitude: 0,
        longitude: 0,
        weights: []
    }



    const { register, control, reset, handleSubmit, formState: { errors } } = useForm<EventType>({ resolver: zodResolver(schema), defaultValues });

    const [popUp, setPopUp] = useState(false);
    const [success, setSuccess] = useState("0")

    const [createEvent, { loading, error }] = useMutation(CREATE_EVENT, {
        onCompleted: (data) => {
            if (data?.createEvent?._id) {
                setSuccess(`${data.createEvent._id}`);
            } else {
                alert("Error creating event");
            }
        }
    });

    useEffect(() => {
        reset();

        return () => {
            setSuccess("0");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success])



    function createEventClick(formValues: EventType) {

        const { name, description, cost, date, link, latitude, longitude, weights } = formValues;

        let formattedDate = new Date(date).toISOString();



        let cleanedFormValues = cleanUndefinedOrNullKeys<EventType>(
            {
                cost,
                date: formattedDate,
                description,
                latitude,
                longitude,
                link,
                name,
                weights
            }
        )


        // below we are transferring the array of numbers for weights into this format:
        //          "weights": [
        //     {
        //         "weight": 0,
        //         "spotsAvailable": [
        //             {
        //                 "userId": "empty",
        //                 "name": "empty"
        //             },
        //             {
        //                 "userId": "636c1778f1d09191074f9690",
        //                 "name": "John"
        //             }
        //         ]
        //     },
        //     {
        //         "weight": 1,
        //         "spotsAvailable": [
        //             {
        //                 "userId": "empty",
        //                 "name": "empty"
        //             },
        //         ]
        //     }
        // ]

        interface userIdEmpty {
            userId: string;
            name: string;
        }

        let representative: number[] = [];

        type emptyObject = {};

        let holder: userIdEmpty | emptyObject = {};

        if (cleanedFormValues.weights) {


            cleanedFormValues.weights.forEach((weight, index) => {

                function pushToRepAndHolder(value: number) {
                    representative.push(value);
                    holder = {
                        ...holder, [String(value)]: [{
                            userId: "empty",
                            name: "empty"
                        }]
                    }
                }

                const trueIfExists = representative.some((rep) => rep === weight) ? true : pushToRepAndHolder(weight);
                if (trueIfExists) {

                    // @ts-ignore
                    // You need to define the types of the keys here I am pretty sure

                    holder[weight].push({
                        userId: "empty",
                        name: "empty"
                    })

                }

            }
            )
        }



        interface arrayFiedInterface {
            weight: number;
            spotsAvailable: userIdEmpty[];
        }[]




        const arrayFideObject = Object.entries(holder).map(([key, value]) => ({ weight: Number(key), spotsAvailable: value }))


        // test to see if all objects in arrayFideObject have spotsAvailable 

        const spotsAvailableExists = arrayFideObject.every((obj) => typeof obj.spotsAvailable == typeof "string");


        if (spotsAvailableExists) {
            createEvent({
                variables: {
                    // @ts-ignore we are good here
                    input: { ...cleanedFormValues, weights: arrayFideObject }

                }
            })
        } else {
            alert("Error creating event no spots available property exists")
        }
    }




    return (
        <div className="myContainer ">
            <h1 className="my-4 text-3xl text-center">Create Event</h1>

            <div className="flex justify-center">
                <form className="[&>input]:mb-4  [&>label]:mr-2" onSubmit={handleSubmit(createEventClick)}>
                    <label htmlFor="name">Name</label>
                    <input type="text" {...register("name")} id="name" className="rounded focus:outline-none focus:ring-1 focus:ring-myRed" />
                    <div>{errors.name?.message}</div>

                    <label htmlFor="description">Description</label>
                    <input type="text" {...register("description")} id="description" className="rounded focus:outline-none focus:ring-1 focus:ring-myRed" />
                    <div>{errors.description?.message}</div>

                    <label htmlFor="cost">Cost</label>
                    <input type="text" {...register("cost")} id="cost" className="rounded focus:outline-none focus:ring-1 focus:ring-myRed" />
                    <div>{errors.cost?.message}</div>

                    <label htmlFor="date">Date</label>
                    <input type="date" {...register("date")} id="date" className="rounded focus:outline-none focus:ring-1 focus:ring-myRed" />
                    <div>{errors.date?.message}</div>

                    <label htmlFor="link">Link</label>
                    <input type="text" {...register("link")} id="link" className="rounded focus:outline-none focus:ring-1 focus:ring-myRed" />
                    <div>{errors.link?.message}</div>

                    <label htmlFor="latitude">Latitude</label>
                    <input type="number" {...register("latitude", { setValueAs: (v: string) => v == "" ? undefined : Number(v) })} id="latitude" className="rounded focus:outline-none focus:ring-1 focus:ring-myRed" />
                    <div>{errors.latitude?.message}</div>

                    <label htmlFor="longitude">Longitude</label>
                    <input type="number" {...register("longitude", { setValueAs: (v: string) => v == "" ? undefined : Number(v) })} id="longitude" className="rounded focus:outline-none focus:ring-1 focus:ring-myRed" />
                    <div>{errors.longitude?.message}</div>

                    <label htmlFor="weights">Weights</label>
                    <input type="text" placeholder="103,113,120,126,132" {...register("weights", { setValueAs: (v: string) => v == "" ? undefined : v.split(",").map((weight) => Number(weight)) })} id="weights" className="rounded focus:outline-none focus:ring-1 focus:ring-myRed" />
                    <AiFillInfoCircle className="inline ml-1" onMouseEnter={() => setPopUp(true)} onMouseLeave={() => setPopUp(false)} onClick={(e) => { e.stopPropagation(); setPopUp(true) }} />
                    {/* make a pop up to display instructions */}
                    {popUp && <div className="absolute z-10 p-2 bg-white border border-black rounded"><div className="flex justify-between"><span>Enter weights separated by commas</span> <BsX color="red" onClick={() => setPopUp(false)} /></div><span className="block text-sm text-ellipsis">to add multiple spots at the same weight just repeat the weight</span></div>}

                    <div>{errors.weights?.message}</div>

                    <div className="flex justify-center">
                        <button type="submit" className="w-full m-2 text-base border-2 rounded-sm shadow-md bg-gradient-to-b from-myGreen to-green-300 border-myDarkGreen hover:ring-2 hover:ring-myLightBlue ">Create Event</button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default CreateEvent;