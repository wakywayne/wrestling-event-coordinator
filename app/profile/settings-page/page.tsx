'use client';
import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const USER_QUERY = gql`
query GetUserById {
      userById{
            name
            email
            availableWeights
        }
    }
    
    
`;

interface Props {

}
interface formType {
    name: string | undefined;
    email: string;
    availableWeights: number[];
}

const SettingPage: React.FC<Props> = () => {


    const { loading, error, data } = useQuery(USER_QUERY);


    // Start of setting up the form

    const schema = z.object({
        name: z.string().min(1).max(100),
        email: z.string().min(1).max(100),
        availableWeights: z.array(z.number()).min(1).max(350)
    });

    // @todo we need to figure out how we can send a new email confirmation to confirm the email change

    const defaultValues = {
        name: "",
        email: "If you are seeing this, you are not logged in",
        availableWeights: []
    };


    const { register, control, reset, handleSubmit, formState: { errors } } = useForm<formType>({ resolver: zodResolver(schema), defaultValues });

    function formFunction(formValues: formType) {
        let { name, email, availableWeights } = formValues;

        console.log(formValues);
    }

    useEffect(() => {
        if (data) {
            reset({
                name: data?.userById.name,
                email: data?.userById.email,
                availableWeights: data?.userById.availableWeights
            });
        }
        return
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])
    // End of setting up the form

    if (loading) { return (<p>Loading...</p>); }

    // function that turns array into a comma separated string
    function arrayToString(array: number[]) {
        let string = "";
        for (let i = 0; i < array.length; i++) {
            string += array[i];
            if (i < array.length - 1) {
                string += ",";
            }
        }
        return string;
    }

    if (data) {

        return (
            <div className='flex myContainerFixed'>
                <form onSubmit={handleSubmit(formFunction)} className=" bg-slate-300 shadow-xl  w-2/3 p-2 mx-auto mb-auto mt-12 lg:my-auto rounded-sm [&>label]:mr-2">
                    <div className="flex justify-center mb-4">
                        <label className='grow'>Name</label>
                        <input className="focus:outline-none grow-3 focus:ring-1 focus:ring-myRed" type="text" {...register("name")} />
                    </div>
                    <div className='italic text-myDarkRed'>{errors.name?.message}</div>
                    <div className="flex justify-center mb-4">
                        <label className='grow'>Email</label>
                        <input className="focus:outline-none grow-3 focus:ring-1 focus:ring-myRed" type="email" {...register("email")} />
                    </div>
                    <div className='italic text-myDarkRed'>{errors.email?.message}</div>
                    <div className="flex justify-center mb-4">
                        <label className=' grow'>Available Weights</label>
                        <input className="focus:outline-none grow-3 focus:ring-1 focus:ring-myRed" type="text" {...register("availableWeights", { setValueAs: (v: string | Array<number>) => Array.isArray(v) ? v : v.split(",").map((weight) => Number(weight)) })} />
                    </div>
                    {/*  */}
                    <div className='italic text-myDarkRed'>{errors.availableWeights?.message}</div>

                    <button type="submit" className="p-2 rounded shadow-sm bg-gradient-to-b from-myRed to-red-400">Submit</button>
                </form>
            </div>
        );
    }

    else {
        return <p>Error :(</p>;
    }
};



export default SettingPage;