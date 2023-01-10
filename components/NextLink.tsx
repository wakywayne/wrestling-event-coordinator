import Link from "next/link";

interface Props {
    url: string;
    text: string;
}

const NextLink: React.FC<Props> = ({ url, text }) => {
    return (
        <>
            <Link href={url}>{text}</Link>
        </>
    )
}

export default NextLink;