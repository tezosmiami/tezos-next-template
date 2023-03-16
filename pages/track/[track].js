import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';
import { usePassengerContext } from "../../context/passenger-context";

const hicdex ='https://api.hicdex.com/v1/graphql'

export const getStaticPaths = async() => {
 
  const queryObjkts = `
    query Objkts($address: String!) {
     hic_et_nunc_token(where: {creator: {address: {_eq: $address}}})  {
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
    const { errors, data } = await fetchGraphQL(queryObjkts, 'Objkts', { address: 'tz1QtcJyqnc6RAL3s5AwzubARTEer5au7c5X' })
    if (errors) {
      console.error(errors)
    }

    const track = data.hic_et_nunc_token.filter(objkt => objkt.id != '615467');
    const paths = track.map(item => {
      return {
        params: {
          track: `${item.id}`
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
        display_uri
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

    const { errors, data } = await fetchGraphQL(queryObjktsbyId, 'ObjktsbyId', { Id: params.track})
    if (errors) {
      console.error(errors)
    }
    const card = data.hic_et_nunc_token[0]

  return {
      props: {card},
  };
};

const TrackCard = ({ card }) => { 
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
 const ownedBy = (card.token_holders[card.token_holders.length-1].holder_id);
  const swaps = (card.swaps[card.swaps.length-1]);


return(
    <>
      <Head>
        <title>Commodore305</title>
        <meta name="description" content="Commodore305" />
        <link rel="icon" href="/tezosmiami.ico" />
        <meta name="description" content={'. . . locally grown worldwide'}/>
        <link rel="canonical" href={`http://commodore305.xyz/track/${card.id}`}/>
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:site" content="@commodore305"/>
        <meta name="twitter:creator" content="@commodore305"/>
        <meta name="twitter:title" content={card.title}/>
        <meta name="twitter:description" content={card.description} />
        <meta name="twitter:image" content={`https://ipfs.io/ipfs/${card.artifact_uri.slice(7)}`} />
        <meta
            name="twitter:description"
            content={card.description}
        />
        
        <meta property="og:title" content={card.title}/>
        <meta property="og:url" content={`https://commodore305.xyz/track/${card.id}`}/>
        <meta property="og:type" content="gallery"/>
        <meta
            property="og:description"
            content={card.description}
        />
    
      </Head>
    <div className='cardcontainer'>

    <a href={`https://hicetnunc.miami/objkt/${card.id}`} target="blank" rel="noopener noreferrer">
    
    </a><p></p>
        <Image 
        alt=""
        width={600}
        height={700}
        unoptimized
        src={'https://ipfs.io/ipfs/' + card.display_uri.slice(7)}>
        </Image>
        <p> {card.title}</p>
        <audio controls style={{ display: 'block', margin: '0 auto' }}
       src={'https://ipfs.io/ipfs/' + card.artifact_uri.slice(7)}>
      </audio>
      <p>
     
      </p>
        {card.description}
        {/* <p>Owned by: <a href={`https://hicetnunc.miami/tz/${ownedBy}`} target="blank" rel="noopener noreferrer">{ownedBy.substr(0, 5) + ". . ." + ownedBy.substr(-5)}</a></p> */}
        <p>
         {(swaps.status==0 && app.address) ? <a onClick={handleCollect(swaps.id, swaps.price)}>{`collect for ${(swaps.price* 0.000001).toFixed(2)} tez`}</a> 
         : swaps.amount == 0 ? 'not for sale' : <button onClick={() => app.logIn()}>sync to collect</button>}
         </p>
    </div>
    
  </>
)
}
export default TrackCard;