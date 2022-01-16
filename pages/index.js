import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useState, useEffect} from 'react'
import { usePassengerContext } from "../context/passenger-context";
import { LightButton } from '../components/light-button';
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
     const shuffleTarot = (a) => {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
     }
     const test = shuffleTarot(tarot);
     setShuffle(test)
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
    {tarot.map(item => (
      <Link key={item.id} href={`/tarotCard/${item.id}`} token={`https://cloudflare-ipfs.com/ipfs/${item.artifact_uri.slice(7)}`} passHref>
        <div className='pop'>
      <Image 
        alt=""
        height={270}
        width={180}
        key={item.id}
        src={'https://cloudflare-ipfs.com/ipfs/' + item.artifact_uri.slice(7)}>
       </Image>
      </div>
      </Link>
     ))}
   </div>
   <p></p>  
  </>
  )
}

