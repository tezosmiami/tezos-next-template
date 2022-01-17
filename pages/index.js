import Head from 'next/head'
import Image from 'next/image'
import {useState, useEffect} from 'react'
import { usePassengerContext } from "../context/passenger-context";

import Link from 'next/link'
const hicdex ='https://hdapi.teztools.io/v1/graphql'


export const getStaticProps = async() => {

  const queryObjkts = `
    query Objkts($address: String!) {
     hic_et_nunc_token(where: {creator: {address: {_eq: $address}}})  {
      id
      artifact_uri
      display_uri
      title
       description
     }
   }
   `;
   async function fetchGraphQL(queryObjkts, name, variables) {
    let result = await fetch(hicdex, {
      method: 'POST',
      body: JSON.stringify({
        query: queryObjkts,
        variables: variables,
        operationName: name,
      }),
    })
    return await result.json()
  }
    const { errors, data } = await fetchGraphQL(queryObjkts, 'Objkts', { address: 'tz1QtcJyqnc6RAL3s5AwzubARTEer5au7c5X' })
    if (errors) {
      console.error(errors)
    }
  
    var tracks = data.hic_et_nunc_token.filter(objkt => objkt.id != '615467');

   

   
  return {
      props: {tracks},
  };
};


export default function Home({ tracks }) {

  const app = usePassengerContext(); 
  return (
    <>
    
      <Head>
        <title>Commodore305 BAZAAR</title>
        <meta name="description" content="Commodore305 Bazaar" />
        <link rel="icon" href="/tezosmiami.ico" />
      </Head>
  <p></p>
    <div className='container'>
    {tracks.map(item => (
      <Link key={item.id} href={`/track/${item.id}`} token={`https://cloudflare-ipfs.com/ipfs/${item.display_uri.slice(7)}`} passHref>
        <div className='pop'>
        <Image
          src={'https://ipfs.io/ipfs/' + item.display_uri.slice(7)}
          width={300} 
          height={300} 
          alt="" />
          <p></p>
       <audio controls style={{ display: 'block', margin: '0 auto' }}
       src={'https://ipfs.io/ipfs/' + item.artifact_uri.slice(7)}>
      </audio>
      </div>
      </Link>
     ))}
   </div>
   <p></p>  
  </>
  )
}

