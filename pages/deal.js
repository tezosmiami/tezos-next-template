import Head from 'next/head'
import Image from 'next/image'
import {useState, useEffect} from 'react'
import { usePassengerContext } from "../context/passenger-context";

import Link from 'next/link'
const hicdex ='https://hdapi.teztools.io/v1/graphql'


export const getStaticProps = async() => {

  const queryObjkts = `
    query Objkts($tag: String!, $address: String!) {
     hic_et_nunc_token(where: {token_tags: {tag: {tag: {_eq: $tag}}}, creator: {address: {_eq: $address}}})  {
      id
      artifact_uri
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
    const { errors, data } = await fetchGraphQL(queryObjkts, 'Objkts', { tag: 'tarot', address: 'tz1X8tdMUnJZtMtQQdcfPbcEeLmfZZ7ybUpM' })
    if (errors) {
      console.error(errors)
    }
    console.log(data)
    const tarot = data.hic_et_nunc_token;
  
  return {
      props: {tarot},
  };
};


export default function Home({ tarot }) {
  const [shuffle,setShuffle] = useState();
  const app = usePassengerContext();  
  
  useEffect(() => {
     const shuffleSliceTarot = (a) => {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a.slice((a.length)-3);
     }
     const hand = shuffleSliceTarot(tarot);
    //  const sliced = hand.slice((tarot.length)-3);
  console.log(hand)
     setShuffle(hand)
  }, [tarot])
   
  return (
    <>
    
      <Head>
        <title>Green Vallery Tarot</title>
        <meta name="description" content="Green Vallery Tarot" />
        <link rel="icon" href="/tezosmiami.ico" />
      </Head>
  <p></p>
    <div className='container'>
    {shuffle && shuffle.map(item => (
      
   
      <Link key={item.id} href={`/tarotCard/${item.id}`} token={`https://cloudflare-ipfs.com/ipfs/${item.artifact_uri.slice(7)}`} passHref>
      
      <Image 
        alt=""
        width={180}
        height={270}
        key={item.id}
        src={'https://cloudflare-ipfs.com/ipfs/' + item.artifact_uri.slice(7)}>
       </Image>
      
      </Link>
       
     ))}
   
   </div>
   <p></p>
   {shuffle && shuffle.map(item => (
      <a>{item.description}</a>))}

   <p></p>  
  </>
  )
}

