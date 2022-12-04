'use client'

import { useApolloClient, gql, } from "@apollo/client";
// I am not using the type gql version here because I am using the client directly
import { Event as EventType } from '@/gql/index';

interface Props {
    events: EventType[];
}

const GET_EVENTS = gql`
    query Events {
    events {
    _id 
    createdBy
    name
    date
    description
        }
    }
`;

const WriteEventsCache: React.FC<Props> = ({ events }) => {

    const client = useApolloClient();
    client.writeQuery({
        query: GET_EVENTS,
        data: {
            events: events
        }
    });

    return (
        <></>
    )
}

export default WriteEventsCache;