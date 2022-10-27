import { gql } from "@apollo/client";

export const QUERY = gql`
  query {
    carts {
        id
        items {
            id
        }
        }
        }
        `;