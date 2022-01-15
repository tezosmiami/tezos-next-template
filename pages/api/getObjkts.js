
hicedex ='https://api.hicdex.com/v1/graphql'


  export async function fetchObjkts(ids) {
    const { errors, data } = await fetchGraphQL(`
      query Objkts($ids: [bigint!] = "") {
        hic_et_nunc_token(where: {id: {_in: $ids}, supply : { _neq : 0 }}) {
          artifact_uri
          display_uri
          creator_id
          id
          mime
          thumbnail_uri
          timestamp
          title
          creator {
            name
            address
          }
        }
      }`, "Objkts", { "ids": ids });
    if (errors) {
      console.log(errors)
    }
    return data
  }
  
 export async function fetchGraphQL(query, name, variables) {
    const result = await fetch(
      hicdex,
      {
        method: "POST",
        body: JSON.stringify({
          query: operationsDoc,
          operationName: name,
          variables: variables,
          
        })
      }
    );
    return await result.json();
  }