'use client'

import { useApolloClient, gql, } from "@apollo/client";
import { ObjectId } from "mongodb";

interface Props {
    userId: ObjectId
}

const GET_USER_BY_ID = gql`
    query User {
    userById {
    _id 
    createdBy
    name
    date
    description
        }
    }
`;

const WriteUserByIdCache: React.FC<Props> = ({ userId }) => {

    const client = useApolloClient();
    client.writeQuery({
        query: GET_USER_BY_ID,
        data: {
            userById: userId
        }
    });

    return (
        <></>
    )
}

export default WriteUserByIdCache;