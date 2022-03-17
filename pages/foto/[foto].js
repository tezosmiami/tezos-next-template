import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react';
import { usePassengerContext } from "../../context/passenger-context";

const hicdex ='https://hdapi.teztools.io/v1/graphql'

const querySubjkt = `
query Subjkt($address: String!) {
  hic_et_nunc_holder(where: {address: {_eq: $address}) {
    name
  }
}
`
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

export const getStaticPaths = async() => {
 
  const queryObjkts = `
    query Objkts($tag: String!) {
     hic_et_nunc_token(where: {supply: {_neq: "0"}, token_tags: {tag: {tag: {_eq: $tag}}}})  {
      id
       }
   }
   `;
   
   
    const { errors, data } = await fetchGraphQL(queryObjkts, 'Objkts', { tag: 'photography' })
    if (errors) {
      console.error(errors)
    }

    const axios = require('axios');
    const response = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc/main/filters/o.json');
    console.log(response);
    const fotos = data.hic_et_nunc_token;

    const paths = fotos.map(item => {
      return {
        params: {
          foto: `${item.id}`
        }
      }
    })

  return {
      paths,
      fallback: 'blocking'
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
        supply
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
    
    const { errors, data } = await fetchGraphQL(queryObjktsbyId, 'ObjktsbyId', { Id: params.foto})
    if (errors) {
      console.error(errors)
    }
    const card = data.hic_et_nunc_token[0]
    // var ownedBy = (card.token_holders[card.token_holders.length-1].holder_id);
    const swaps = card.swaps[card.swaps.length-1] || null;
    const supply = card.supply || null;
console.log(supply)
  return {
      props: { card, supply, swaps },
  };
};

const Foto = ({ card, supply, swaps }) => { 
const [message,setMessage] = useState();
const [name,setName] = useState()
const app = usePassengerContext();

// useEffect(async () => {
//   const { errors, data } = await fetchGraphQL(querySubjkt, 'Subjkt', { address: ownedBy })
//   if (errors) {
//     console.error(errors)
//   }
 
//   data.hic_et_nunc_holder[0] && setName(data.hic_et_nunc_holder[0].name);
//  }, [])


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
 


return(
    <>
      <Head>
        <title>fotographia.xyz</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/tezosmiami.ico" />
      </Head>
    <div className='cardcontainer'>

    <a href={`https://hicetnunc.miami/objkt/${card.id}`} target="blank" rel="noopener noreferrer">
    {card.title}
    </a><p></p>
        <Image 
        alt=""
        width={400}
        height={600}
        src={'https://cloudflare-ipfs.com/ipfs/' + card.artifact_uri.slice(7)}>
        </Image>
        <p></p>
        <li> {card.description}</li>
        <p>{supply} editions</p>
        {/* <p>owned by: <a href={`https://hicetnunc.miami/tz/${ownedBy}`} target="blank" rel="noopener noreferrer">{name || ownedBy.substr(0, 5) + "..." + ownedBy.substr(-5) }</a></p> */}
         {swaps.supply && swaps.status==0 ? <a onClick={handleCollect(swaps.id, swaps.price)}>{`collect for ${(swaps.price* 0.000001).toFixed(2)} tez`}</a> : 'not for sale'}
    </div>
    
  </>
)
}
export default Foto;