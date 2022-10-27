import { gql } from "@apollo/client";


export const mutation = gql`
  mutation {
    carts {
        id
        items {
            id
        }
        }
        }
        `;