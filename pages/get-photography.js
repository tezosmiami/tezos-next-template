import { gql, request } from 'graphql-request';

const query_tag = gql`
query ObjktsByTag {
  hic_et_nunc_token(where: {supply : { _neq : 0 }, token_tags: {tag: {tag: {_eq: 'photography'}}}, id: {_lt: $lastId}}, limit : 15, order_by: {id: desc}) {
    id
    artifact_uri
    display_uri
    mime
    token_tags {
      tag {
        tag
      }
    }
    creator {
      address
      name
    }
  }
}`

const getObjktsByTag = async(tag) => {
    const response = await request(
        'https://api.hicdex.com/v1/graphql',
        query,
        {tag: tag},
    );
    return response?.hic_et_nunc_token?.map(o => ({
        id: o.id,
        creator: {
            walletAddress: o.creator_id,
            ...o.creator,
        },
        title: o.title,
        src: getIpfsUrl(o.artifact_uri),
        mimeType: o.mime,
        displayUri: o.display_uri,
    })) || [];
};

export default getObjktsByTag;
