"use client";

import { AiOutlineCheck, AiOutlineRollback } from "react-icons/ai";
import { FiX } from "react-icons/fi";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@/src/__generated__/gql";
import { BsPencilSquare } from "react-icons/bs";
import RadioButton from "@/components/RadioButton";
import { useEffect, useState } from "react";
import { applicant as eventApplicant } from "@/gql/index";
// form stuff
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { boolean, z } from "zod";
import { ObjectId } from "bson";
import Router from "next/router";

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
            cost
            createdBy
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

const ACCEPT_OR_REJECT_APPLICANT_MUTATION = gql(`
    mutation AcceptApplicant($input:MutationAcceptApplicantInput!) {
        acceptApplicant(input:$input)
     }
`);

const DELETE_EVENT_MUTATION = gql(`
    mutation DeleteEventInEditCreatedEvent($id: mongoId!) {
        deleteEvent(id:$id)
      }
`);

const CreatedEventEdit: React.FC<Props> = ({ params }) => {
  const { loading, error, data } = useQuery(CREATED_EVENT_QUERY, {
    variables: {
      id: params.id,
    },
  });

  type applicant = "applicant";

  const [edit, setEdit] = useState<boolean | applicant>(false);

  // Logic for the form

  useEffect(() => {
    reset({
      name: data?.eventById?.name ? data.eventById.name : "",
      description: data?.eventById?.description
        ? data.eventById.description
        : "",
      cost: data?.eventById?.cost ? data.eventById.cost : "",
      link: data?.eventById?.link ? data.eventById.link : "",
    });

    return () => {
      reset();
    };
  }, [data]);

  interface EventType {
    cost?: string;
    description: string;
    link?: string;
    name: string;
  }

  const schema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
    cost: z.string().min(0).max(100).optional(),
    // date: z.string().min(1).max(100),
    link: z.string().min(0).max(100).optional(),
    // latitude: z.number().min(-90).max(90),
    // longitude: z.number().min(-180).max(180),
    // weights: z.array(z.number()).min(1).max(350).optional()
  });

  const defaultValues = {
    name: data?.eventById?.name ? data.eventById.name : "",
    description: data?.eventById?.description ? data.eventById.description : "",
    cost: data?.eventById?.cost ? data.eventById.cost : "",
    link: data?.eventById?.link ? data.eventById.link : "",
  };

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<EventType>({ resolver: zodResolver(schema), defaultValues });

  function editEventClick(formValues: any) {
    console.log(formValues);
  }
  // end of form logic

  const [
    acceptOrRejectApplicantMutation,
    { data: mutationData, error: mutationError },
  ] = useMutation(ACCEPT_OR_REJECT_APPLICANT_MUTATION, {
    refetchQueries: [
      {
        query: CREATED_EVENT_QUERY,
        variables: {
          id: params.id,
        },
      },
      "EventById",
    ],
  });

  const [
    deleteEventMutation,
    { data: deleteEventMutationData, error: deleteEventMutationError },
  ] = useMutation(DELETE_EVENT_MUTATION, {
    onCompleted: () => {
      Router.push("/events");
    },
  });

  let acceptOrRejectApplicantClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    let array = e.currentTarget.name.split("|||");

    let eventId = new ObjectId(array[0]);
    let eventCreatedById = new ObjectId(array[1]);
    let applicantId = array[2];
    let applicantName = array[3];
    let boolean = array[4] === "true" ? true : false;
    let weight = Number(array[5]);

    console.log({
      eventId,
      eventCreatedById,
      applicantId,
      applicantName,
      boolean,
      weight,
    });

    const result = await acceptOrRejectApplicantMutation({
      variables: {
        input: {
          eventId: eventId,
          createdBy: eventCreatedById,
          applicantId: applicantId,
          applicantName: applicantName,
          boolean: boolean,
          weight: weight,
        },
      },
    });

    if (result.data?.acceptApplicant) {
      console.log(result);
      alert("success");
    } else {
      alert("failure");
    }
  };

  if (mutationError) {
    alert("there was an error");
  }

  if (error) return <p>Error :(</p>;

  if (data?.eventById) {
    let applicantsExist = data.eventById.eventApplicants?.length;
    let weightsExist = data.eventById.weights?.length;

    if (!edit) {
      return (
        <div className="relative ">
          <h1 className="text-4xl font-bold text-center mt-7">
            {data.eventById.name} Event
          </h1>
          <div className="p-2 rounded pattern">
            <div className="flex flex-col items-center justify-center mt-6">
              {/*display the weights for the event */}
              <div className="flex flex-col items-center justify-center ">
                <p className="my-1 text-xl ">{data.eventById.date}</p>
                <a
                  href={`${data.eventById.link}`}
                  target="_blank"
                  className="my-1 text-xl underline text-myLightBlue"
                  rel="noreferrer"
                >
                  Event Link
                </a>
                <div className="flex items-center">
                  <p className="my-1 mr-1 text-xl">Has Applicants: </p>
                  {applicantsExist ? <AiOutlineCheck /> : <FiX />}
                </div>
                <div className="flex flex-col items-center w-full ">
                  <h6 className="mx-auto text-xl ">Weight Spots</h6>
                  {/* @ts-ignore we are good here*/}
                  {data?.eventById?.weights ? (
                    data.eventById.weights.map((weight: any, index: number) => {
                      return (
                        <div
                          key={`dataEventsByIdWeights ${index}`}
                          className="flex flex-wrap items-center justify-start w-full px-2 my-2 bg-white border-2 border-black border-solid rounded-full"
                        >
                          <p className="my-1 mr-1 text-xl">
                            {weight.weight}
                            <sub>lbs</sub>:
                          </p>
                          {weight.spotsAvailable.map(
                            (spot: any, index: number) => {
                              // return spot.userId !== "empty" ? <input type='radio' className='my-1 mr-1 text-xl' checked /> : <input type='radio' className='my-1 mr-1 text-xl' />
                              return spot.userId !== "empty" ? (
                                <RadioButton
                                  checked={true}
                                  key={`truecheckboxinprofile${index}`}
                                />
                              ) : (
                                <RadioButton
                                  checked={false}
                                  key={`falsecheckboxinprofile${index}`}
                                />
                              );
                            }
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="my-1 text-xl">No weights added</p>
                  )}
                </div>
                {data?.eventById?.weights ? (
                  <p className="my-1 text-xl ">
                    {/* @ts-ignore not sure about this one... */}
                    {data.eventById.weights.weight}
                  </p>
                ) : (
                  <p className="my-1 text-xl">No weights added</p>
                )}
                <p className="my-1 text-xl ">{data.eventById.description}</p>
                {/* <p>{data.eventById.weights.spotsAvailable.name}</p> */}
                {/* <p>{data.eventById.weights.spotsAvailable.userId}</p> */}
              </div>

              {/* make a small button */}
            </div>
          </div>
          <button
            onClick={() => setEdit(true)}
            className="absolute top-0 flex p-2 text-xs text-white rounded-lg bg-myRed hover:bg-red-700 right-3 hover:cursor-pointer myFocus:ring-4 ring-red-300"
          >
            <span className="mr-1 ">Edit</span> <BsPencilSquare />
          </button>
          <button
            onClick={() => setEdit("applicant")}
            className="absolute flex p-2 text-xs text-white rounded-lg top-10 bg-myGreen hover:bg-green-700 right-3 hover:cursor-pointer myFocus:ring-4 ring-green-500"
          >
            <span className="mr-1 ">View Applicants</span> <BsPencilSquare />
          </button>
        </div>
      );
    } else if (edit && edit != "applicant") {
      return (
        <div className="relative myContainer">
          <button
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this event?")
              ) {
                deleteEventMutation({ variables: { id: params.id } });
              }
            }}
            className="absolute top-0 left-3 flex p-2 text-xs text-white rounded-lg bg-black hover:bg-gray-700 hover:cursor-pointer myFocus:ring-4 ring-grey-300"
          >
            <span className="mr-1 ">Delete</span>
            <AiOutlineRollback />{" "}
          </button>

          <h2 className="my-4 text-3xl text-center">Edit Event</h2>
          <p className="my-4 text-sm text-center lg:text-base">
            <em>
              We apologize for any inconvenience, but we currently can&apos;t
              handle changing weights, dates, and locations
            </em>
          </p>

          <div className="flex justify-center">
            <form
              className="w-full xl:w-9/12 2xl:7/12 create-event-grid [&>div]:my-2"
              onSubmit={handleSubmit(editEventClick)}
            >
              <div className="flex items-center justify-center w-full py-3 ">
                <label
                  htmlFor="name"
                  className="h-full ml-12 mr-4 text-xl font-bold text-center xl:font-medium lg:text-lg"
                >
                  Name
                </label>
                <input
                  type="text"
                  {...register("name")}
                  id="name"
                  className="h-10 mr-12 rounded lg:h-7 xl:h-6 grow-3 focus:outline-none focus:ring-1 focus:ring-myRed"
                />
              </div>
              <div>{errors.name?.message}</div>
              <div className="flex items-center justify-center w-full ">
                <label
                  className="ml-12 mr-4 text-lg font-bold text-center xl:font-medium "
                  htmlFor="description"
                >
                  Description
                </label>
                <input
                  type="text"
                  {...register("description")}
                  id="description"
                  className="h-10 mr-12 rounded lg:h-7 xl:h-6 focus:outline-none focus:ring-1 focus:ring-myRed grow-3"
                />
              </div>
              <div>{errors.description?.message}</div>
              <div className="flex items-center justify-center w-full ">
                <label
                  className="ml-12 mr-4 text-lg font-bold text-center xl:font-medium "
                  htmlFor="cost"
                >
                  Cost
                </label>
                <input
                  type="text"
                  {...register("cost")}
                  id="cost"
                  className="h-10 mr-12 rounded lg:h-7 xl:h-6 focus:outline-none focus:ring-1 focus:ring-myRed grow-3"
                />
              </div>
              <div>{errors.cost?.message}</div>
              {/* <div className="flex items-center justify-center w-full ">
                                <label className="ml-12 mr-4 text-lg font-bold text-center xl:font-medium " htmlFor="date">Date</label>
                                <input type="date" {...register("date")} id="date" className="h-10 mr-12 rounded lg:h-7 xl:h-6 focus:outline-none focus:ring-1 focus:ring-myRed grow-3" />
                            </div>
                            <div>{errors.date?.message}</div> */}
              <div className="flex items-center justify-center w-full ">
                <label
                  className="ml-12 mr-4 text-lg font-bold text-center xl:font-medium "
                  htmlFor="link"
                >
                  Link
                </label>
                <input
                  type="text"
                  {...register("link")}
                  id="link"
                  className="h-10 mr-12 rounded lg:h-7 xl:h-6 focus:outline-none focus:ring-1 focus:ring-myRed grow-3"
                />
              </div>
              <div>{errors.link?.message}</div>
              {/* <div className="flex items-center justify-center w-full ">
                                <label className="ml-12 mr-4 text-lg font-bold text-center xl:font-medium " htmlFor="latitude">Latitude</label>
                                <input type="number" {...register("latitude", { setValueAs: (v: string) => v == "" ? undefined : Number(v) })} id="latitude" className="h-10 mr-12 rounded lg:h-7 xl:h-6 focus:outline-none focus:ring-1 focus:ring-myRed grow-3" />
                            </div>
                            <div>{errors.latitude?.message}</div>
                            <div className="flex items-center justify-center w-full ">
                                <label className="ml-12 mr-4 text-lg font-bold text-center xl:font-medium " htmlFor="longitude">Longitude</label>
                                <input type="number" {...register("longitude", { setValueAs: (v: string) => v == "" ? undefined : Number(v) })} id="longitude" className="h-10 mr-12 rounded lg:h-7 xl:h-6 focus:outline-none focus:ring-1 focus:ring-myRed grow-3" />
                            </div>
                            <div>{errors.longitude?.message}</div>
                            <div className="flex items-center justify-center w-full ">
                                <label className="ml-12 mr-4 text-lg font-bold text-center xl:font-medium " htmlFor="weights">Weights</label>
                                <input type="text" placeholder="103,113,120,126,132" {...register("weights", { setValueAs: (v: string) => v == "" ? undefined : v.replace(/ /g, "").split(",").map((weight) => Number(weight)) })} id="weights"
                                    className="h-10 rounded lg:h-7 xl:h-6 focus:outline-none focus:ring-1 focus:ring-myRed grow-3" />
                                <AiFillInfoCircle className="inline ml-1 mr-12" title="Click For Instructions" name="Click Here For Instructions" onClick={() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); setPopUp(true) }} />
                                
                            </div>
                            {popUp && <div className="z-10 p-2 bg-white border border-black rounded"><div className="flex justify-between"><span>Enter weights separated by commas</span> <BsX color="red" onClick={() => setPopUp(false)} /></div><span className="block text-sm text-ellipsis">to add multiple spots at the same weight just repeat the weight in the list</span></div>}
                            <div>{errors.weights?.message}</div> */}
              <div className="flex justify-center w-full">
                <button
                  type="submit"
                  className="w-3/4 m-2 text-lg border-2 rounded-sm shadow-md bg-gradient-to-b from-myGreen to-green-300 border-myDarkGreen hover:ring-2 hover:ring-myLightBlue "
                >
                  Update Event
                </button>
              </div>
            </form>
          </div>
          <button
            onClick={() => setEdit(false)}
            className="absolute top-0 flex p-2 text-xs text-white rounded-lg bg-myRed hover:bg-red-700 right-3 hover:cursor-pointer myFocus:ring-4 ring-red-300"
          >
            <span className="mr-1 ">Back</span>
            <AiOutlineRollback />{" "}
          </button>
        </div>
      );
    } else if (edit == "applicant") {
      return (
        <div className="relative mt-1 myContainer">
          <h1 className="text-3xl font-bold text-center">Created Events</h1>
          <div className="grid grid-auto-fit">
            {data.eventById?.eventApplicants ? (
              data.eventById.eventApplicants.map(
                (user: eventApplicant, key: number) => {
                  return (
                    <div
                      key={`${key}createdEventApplicant${user.userId}`}
                      className="relative m-4 border-2 rounded-lg shadow-lg bg-gradient-to-tl from-slate-400 to-slate-300 "
                    >
                      <p className="m-2 text-lg font-semibold tracking-wider text-center text-black rounded-full font-poppins ">
                        {user.name}
                      </p>
                      <small className="block text-center text-black">
                        for
                      </small>
                      <div className="flex justify-center rounded-t-lg ">
                        <div className="w-11/12 mb-2 bg-white border-2 rounded-sm decoration-from-font ">
                          <p className="my-1 text-2xl text-center">
                            {user.weight}
                            <sub>lbs</sub>
                          </p>
                        </div>
                      </div>
                      {/* create a red button */}
                      <div className="flex flex-wrap justify-center">
                        <button
                          onClick={(e) => acceptOrRejectApplicantClick(e)}
                          name={`${data.eventById?._id}|||${
                            data.eventById?.createdBy
                          }|||${user.userId}|||${user.name}|||${true}|||${
                            user.weight
                          }`}
                          className="px-4 py-2 m-2 text-xs font-semibold text-white rounded-full bg-gradient-to-br from-myGreen to-green-500 "
                        >
                          Accept Applicant
                        </button>
                        <button
                          onClick={(e) => acceptOrRejectApplicantClick(e)}
                          name={`${data.eventById?._id}|||${
                            data.eventById?.createdBy
                          }|||${user.userId}|||${user.name}|||${false}|||${
                            user.weight
                          }`}
                          className="px-4 py-2 m-2 text-xs font-semibold text-white rounded-full bg-gradient-to-br from-myRed to-red-400 "
                        >
                          Decline Applicant
                        </button>
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <p>No applicants</p>
            )}
            <button
              onClick={() => setEdit(false)}
              className="absolute top-0 flex p-2 text-xs text-white rounded-lg bg-myRed hover:bg-red-700 right-3 hover:cursor-pointer myFocus:ring-4 ring-red-300"
            >
              <span className="mr-1 ">Back</span>
              <AiOutlineRollback />{" "}
            </button>
          </div>
        </div>
      );
    } else {
      return <p>Event not found</p>;
    }
  } else {
    return <p>Event not found</p>;
  }
};

export default CreatedEventEdit;
