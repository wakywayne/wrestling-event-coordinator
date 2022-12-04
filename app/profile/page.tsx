'use client';

import { useQuery } from '@apollo/client';
import { gql } from '@/src/__generated__';

interface Props {

}

const USER_QUERY = gql(`
query UserByIdProfile {
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
`);

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