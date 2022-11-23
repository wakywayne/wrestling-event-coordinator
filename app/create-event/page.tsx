'use client'

import { useMutation, gql } from "@apollo/client";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

const CREATE_EVENT = gql`
mutation CreateEvent($input: MutationCreateEventInput!){
    createEvent(input:$input){
        _id
        name
        description
        cost
        date
        link
        latitude
        longitude
    }
}
`;


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


    const [createEvent, { loading, error }] = useMutation(CREATE_EVENT, {
        onCompleted: (data) => {
            console.log(data);

        }
    });

    // const [event, setEvent] = useState<EventType>({
    //     cost: "",
    //     date: String(new Date()),
    //     description: "",
    //     latitude: 0,
    //     longitude: 0,
    //     link: "",
    //     name: ""
    // });

    function createEventClick(formValues: EventType) {

        const { name, description, cost, date, link, latitude, longitude } = formValues;

        // createEvent({
        //     variables: {
        //         input: {
        //             cost: event.cost,
        //             date: event.date,
        //             description: event.description,
        //             latitude: event.latitude,
        //             longitude: event.longitude,
        //             link: event.link,
        //             name: event.name
        //         }
        //     }
        // })
        console.log(formValues);
        reset();
    }

    // const onFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    //     setEvent({
    //         ...event,
    //         [e.target.name]: e.target.value
    //     })
    // }


    return (
        <div className="h-screen ">
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
                    <input type="text" {...register("weights", { setValueAs: (v: string) => v == "" ? undefined : v.split(",").map((weight) => Number(weight)) })} id="weights" className="rounded focus:outline-none focus:ring-1 focus:ring-myRed" />
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