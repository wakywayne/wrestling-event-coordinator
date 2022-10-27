import type { NextPage } from 'next'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { apiUrl } from '../config';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import DisplayCarts from '@/components/DisplayCarts';
import React from 'react';

const Home: NextPage = () => {

  const client = new ApolloClient({
    uri: `${apiUrl}/api`,
    cache: new InMemoryCache(),
  });

  //   client.query({
  //     query: gql`
  //     query {
  //       carts{
  // id
  // items{
  //   name
  // }
  //     }
  //     }`
  //   }).then(result => console.log(result.data));


  return (
    <React.Fragment>
      <ApolloProvider client={client}>
        <div className=" debug-screens" >
          <DisplayCarts />
        </div >
      </ApolloProvider>

      <ApolloProvider client={client}>

      </ApolloProvider>
    </React.Fragment>
  )
}

export default Home
