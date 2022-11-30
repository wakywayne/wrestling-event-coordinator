import Link from 'next/link'
import { BsCardChecklist } from 'react-icons/bs';
import { AiTwotoneSetting } from 'react-icons/ai';
import { IoIosCreate } from 'react-icons/io';
import { ReactElement } from 'react';


interface Props {
    children: React.ReactNode;
}



const EventsLayout = async ({ children }: { children: ReactElement }) => {


    return (
        <>
            <div className="flex flex-col myContainer lg:flex-row">
                <div className="flex flex-row py-4 text-black rounded-br-lg shadow-sm lg:w-3/12 3xl:w-4/12 bg-gradient-to-tl from-myGreen to-green-300 mt-18 lg:flex-col ">
                    {/* sidebar header */}
                    {/* sidebar links */}
                    <div className="flex flex-row flex-1 mx-8 lg:flex-col">
                        {/* <nav className="flex-1 px-2 py-4 bg-white"> */}
                        <Link href="/profile/created-events"
                            className="flex items-center px-2 py-2 mb-2 text-sm font-medium leading-5 text-gray-800 transition-colors duration-150 rounded-lg cursor-pointer hover:text-gray-800 hover:bg-gray-100">
                            <IoIosCreate className="mr-4 text-3xl lg:text-6xl " />
                            <span>View Your Created Events</span>
                        </Link>
                        <Link href="/profile/applied-events"
                            className="flex items-center px-2 py-2 mb-2 text-sm font-medium leading-5 text-gray-800 transition-colors duration-150 rounded-lg cursor-pointer hover:text-gray-800 hover:bg-gray-100">
                            <BsCardChecklist className="mr-4 text-3xl lg:text-6xl " />
                            <span>View Events You Applied to </span>
                        </Link>
                        <Link href="/profile/settings-page"
                            className="flex items-center px-2 py-2 mb-2 text-sm font-medium leading-5 text-gray-800 transition-colors duration-150 rounded-lg cursor-pointer hover:text-gray-800 hover:bg-gray-100">
                            <AiTwotoneSetting className="mr-4 text-3xl lg:text-6xl " />
                            <span>View Your Profile Settings</span>
                        </Link>
                    </div>
                </div>

                <div className='flex-grow '>
                    {children}
                </div>
            </div>
        </>
    )
}

export default EventsLayout;