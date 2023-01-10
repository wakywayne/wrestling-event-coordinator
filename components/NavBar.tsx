import Link from 'next/link'
import Image from 'next/image'

interface Props {

}

const NavBar: React.FC<Props> = () => {
    return (
        <>
            <nav className="relative z-10 flex items-center w-screen p-6 bg-black h-mobileNav lg:h-nav md:justify-between">
                <div className="flex items-center flex-shrink-0 mr-6 text-white">
                    <Image src="/logoWithoutWords.png" alt="logo" width={100} height={100} />
                </div>
                <div className="flex items-center w-full ">
                    <div className="flex flex-grow text-base lg:text-base 2xl:justify-evenly 2xl: justify-evenly lg:justify-start">
                        <Link href="/" className="block mr-4 text-white hover:text-myLightBlue lg:inline-block lg:mt-0">
                            Home
                        </Link>
                        <Link href="/events" className="block mr-4 text-white hover:text-myLightBlue lg:inline-block lg:mt-0">
                            Events
                        </Link>
                        <Link href="/profile" className="block text-white hover:text-myLightBlue lg:inline-block lg:mt-0">
                            Profile
                        </Link>
                    </div>
                    <div className='ml-auto '>
                        <Link href="/create-event"
                            className="inline-block px-4 py-2 text-sm leading-none text-white border border-white rounded hover:border-transparent hover:text-myLightBlue hover:bg-white lg:mt-0">
                            Create Event
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default NavBar;
