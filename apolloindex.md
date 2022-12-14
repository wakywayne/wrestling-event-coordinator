import type { NextPage } from 'next'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { apiUrl } from '../config';
import Link from 'next/link';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import DisplayCarts from '@/components/DisplayCarts';
import React from 'react';

const Home: NextPage = () => {

  const cache = new InMemoryCache({
    typePolicies: {
      Mutation: {
        fields: {
          addItem: {
            merge(existing, incoming) {
              return incoming;
            }
          }
        }
      }
    }
  });

  const client = new ApolloClient({
    uri: `${apiUrl}/api`,
    cache
  });



  return (
    <React.Fragment>
      <ApolloProvider client={client}>
        <div className=" debug-screens" >
          <Link href='/login'>Login</Link>
          <DisplayCarts />
        </div >
      </ApolloProvider>

      <ApolloProvider client={client}>

      </ApolloProvider>
    </React.Fragment>
  )
}

export default Home
