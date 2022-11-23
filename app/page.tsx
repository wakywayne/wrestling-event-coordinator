import Link from 'next/link'



interface Props {

}

const Main: React.FC<Props> = () => {



    return (
        <>

            <div className="h-screen ">
                {/* Make a card that is centered absolutely and asks if the user wants  */}
                <div className="flex justify-center">
                    <div className="z-10 w-3/4 mt-12 border-2 border-solid rounded-lg shadow-xl bg-slate-300 border-slate-800">
                        <div className="flex justify-center py-4 font-poppins">
                            <div className="relative text-center ">
                                <h1 className="inline-block px-8 py-2 text-xl text-center underline">
                                    Welcome to the Event App
                                </h1>
                                <p className="mt-3 text-lg">
                                    Welcome to the Event App. This is a place where you can find tournament groups and create tournament groups.
                                </p>
                                <hr className="bg-myDarkBlue " />
                                <div className="grid gap-4 grid-col-1 lg:grid-cols-2">
                                    {/* <Link href="/login/signin?callbackUrl=/" className="inline m-2 mt-4 text-base border-2 rounded-full shadow-md lg:mt-2 border-myDarkRed bg-gradient-to-br from-red-600 via-myRed to-red-400 hover:pb-1 hover:border-0 hover:ring-2 hover:ring-black lg:text-lg">
                                        <div ><p>Continue as guest?</p>
                                            <span className="underline ">Click Here</span>
                                        </div>
                                    </Link> */}
                                    <Link href="/events" className="inline m-2 mt-4 text-base border-2 rounded-full shadow-md lg:mt-2 border-myDarkRed bg-gradient-to-b from-myRed to-red-300 hover:pb-1 hover:border-0 hover:ring-2 hover:ring-black lg:text-lg">
                                        <div ><p>Continue as guest?</p>
                                            <span className="underline ">Click Here</span>
                                        </div>
                                    </Link>

                                    <Link href="/login/signin?callbackUrl=/events" className="inline m-2 text-base border-2 rounded-full shadow-md bg-gradient-to-b from-myGreen to-green-300 border-myDarkGreen hover:pb-1 hover:border-0 hover:ring-2 hover:ring-black lg:text-lg">
                                        <div ><p>Login/Sign Up</p>
                                            <span className="underline ">Click Here</span>
                                        </div>
                                    </Link>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Main;