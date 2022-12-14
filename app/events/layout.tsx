import Link from 'next/link'
import { IoScale } from 'react-icons/io5';
import { FaMapMarked } from 'react-icons/fa';

interface Props {
    children: React.ReactNode;
}


const EventsLayout: React.FC<Props> = ({ children }) => {
    return (
        <>

            <div className="flex flex-col myContainer lg:flex-row">
                <div className="flex flex-row py-4 text-black rounded-br-lg shadow-sm lg:w-3/12 3xl:w-4/12 bg-gradient-to-tl from-slate-400 to-slate-300 mt-18 lg:flex-col ">
                    {/* sidebar header */}
                    <div className='hidden lg:block'>
                        <span className="mx-8 text-xl font-semibold tracking-tight underline lg:ml-2">Filters</span>
                    </div>
                    {/* sidebar links */}
                    <div className="flex flex-row flex-1 mx-8 lg:flex-col">
                        {/* <nav className="flex-1 px-2 py-4 bg-white"> */}
                        <Link href="/events/events-by-location"
                            className="flex items-center px-2 py-2 mb-2 text-sm font-medium leading-5 text-gray-800 transition-colors duration-150 rounded-lg cursor-pointer hover:text-gray-800 hover:bg-gray-100">
                            {/* <FaMapMarked className='mr-4 text-4xl lg:text-6x text-myGreen' /> */}
                            <FaMapMarked className="mr-4 text-3xl lg:text-6xl " />
                            <span>View All Events Closest to You</span>
                        </Link>
                        <Link href="/events/events-by-weight"
                            className="flex items-center px-2 py-2 mb-2 text-sm font-medium leading-5 text-gray-800 transition-colors duration-150 rounded-lg cursor-pointer hover:text-gray-800 hover:bg-gray-100">
                            {/* <IoScale className="mr-4 text-4xl text-myRed lg:text-7xl" /> */}

                            <IoScale className="mr-4 text-4xl cursor-pointer lg:text-7xl " />
                            <span>View Events With Your Weight Available</span>
                        </Link>
                        <Link href="/events/events-by-weight-and-location"
                            className="flex items-center px-2 py-2 mb-2 text-sm font-medium leading-5 text-gray-800 transition-colors duration-150 rounded-lg cursor-pointer hover:text-gray-800 hover:bg-gray-100">
                            <div className="flex flex-col">
                                {/* <FaMapMarked className="mr-4 text-2xl lg:text-3xl text-myGreen" />
                            <IoScale className="mr-4 text-2xl lg:text-3xl text-myRed" /> */}

                                <FaMapMarked className="mr-4 text-2xl lg:text-3xl " />
                                <IoScale className="mr-4 text-2xl lg:text-3xl " />

                            </div>

                            <span>View Events Closest to You With Weight Available</span>
                        </Link>
                    </div>
                </div>
                <div className='flex-grow'>
                    {children}
                </div>
            </div>
        </>
    )
}

export default EventsLayout;