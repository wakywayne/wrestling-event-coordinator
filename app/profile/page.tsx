'use client';

import { useQuery, gql } from '@apollo/client';

interface Props {

}

const USER_QUERY = gql`
query GetUserById {
      userById{
            name
            email
            availableWeights
            createdEvents {
                createdEventId
                eventName
                createdEventDescription
                createdEventDate
                createdEventWeights{
                    weight
                    filled
                }
            }
            signedUpEvents {
                accepted
                eventName
                signedUpEventDate
                signedUpEventId
        }
        }
    }
`;

const Updates: React.FC<Props> = () => {

    // apollo use query hook
    const { data, loading, error } = useQuery(USER_QUERY);



    return (
        <div>
            <h1>Updates</h1>

            <p>Updates will be posted here</p>
        </div>
    )
}

export default Updates;