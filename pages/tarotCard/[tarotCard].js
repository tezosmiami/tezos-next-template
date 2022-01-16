import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';
import { usePassengerContext } from "../../context/passenger-context";

const hicdex ='https://api.hicdex.com/v1/graphql'

export const getStaticPaths = async() => {
 
  const queryObjkts = `
    query Objkts($tag: String!, $address: String!) {
     hic_et_nunc_token(where: {token_tags: {tag: {tag: {_eq: $tag}}}, creator: {address: {_eq: $address}}})  {
      id
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

    const tarot = data.hic_et_nunc_token;
    const paths = tarot.map(item => {
      return {
        params: {
          tarotCard: `${item.id}`
        }
      }
    })

  return {
      paths,
      fallback: false,
  };
};

export const getStaticProps = async({params}) => {
  const queryObjktsbyId = `
      query ObjktsbyId($Id: bigint!) {
      hic_et_nunc_token(where: {id: {_eq: $Id}}) {
        artifact_uri
        description
        id
        title
        token_holders{
         holder_id
        }
        swaps {
          amount
          price
          status
          id
        }
      }
    }`
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

    const { errors, data } = await fetchGraphQL(queryObjktsbyId, 'ObjktsbyId', { Id: params.tarotCard})
    if (errors) {
      console.error(errors)
    }
    const card = data.hic_et_nunc_token


  return {
      props: {card},
  };
};

const TarotCard = ({ card }) => { 
const [message,setMessage] = useState();
const app = usePassengerContext();
const handleCollect = (swapId, xtzAmount) => async() => {
  try {
      setMessage('Preparing Objkt. . .');
      const isCollected = await app.collect(swapId, xtzAmount);
      setMessage(isCollected ? 'You got it!' : 'Something happened, try again. . .');
    
  } catch(e) {
      setMessage('Objkt not found - please try again. . .');
      console.log('Error: ', e);
  }
  setTimeout(() => {
      setMessage(null);
  }, 3200);
};
 const ownedBy = (card[0].token_holders[card[0].token_holders.length-1].holder_id);
  const swaps = (card[0].swaps[card[0].swaps.length-1]);


return(
    <>
      <Head>
        <title>GreenValley Tarot</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/tezosmiami.ico" />
      </Head>
    <div className='cardcontainer'>

    <a href={`https://hicetnunc.miami/objkt/${card[0].id}`} target="blank" rel="noopener noreferrer">
    {card[0].title}
    </a><p></p>
        <Image 
        alt=""
        width={400}
        height={600}
        src={'https://cloudflare-ipfs.com/ipfs/' + card[0].artifact_uri.slice(7)}>
        </Image>
        <p></p>
        {card[0].description}
        <p>Owned by: <a href={`https://hicetnunc.miami/tz/${ownedBy}`} target="blank" rel="noopener noreferrer">{ownedBy.substr(0, 5) + ". . ." + ownedBy.substr(-5)}</a></p>
         {swaps.status==0 ? <a onClick={handleCollect(swaps.id, swaps.price)}>{`collect for ${(swaps.price* 0.000001).toFixed(2)} tez`}</a> : 'not for sale'}
    </div>
    
  </>
)
}
export default TarotCard;