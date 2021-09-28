import { Shopify } from '@shopify/shopify-api';

const ApiVersion = {
  April19: '2019-04',
  July19: '2019-07',
  October19: '2019-10',
  January20: '2020-01',
  April20: '2020-04',
  July20: '2020-07',
  October20: '2020-10',
  January21: '2021-01',
  April21: '2021-04',
  July21: '2021-07',
  Unstable: 'unstable',
  Unversioned: 'unversioned',
};

const graphqlProxy = async (shopName, token, ctx) => {
  let reqBodyString = '';

  // eslint-disable-next-line promise/param-names
  const promise = new Promise((resolve, _reject) => {
    ctx.req.on('data', (chunk) => {
      reqBodyString += chunk;
    });

    ctx.req.on('end', async () => {
      let reqBodyObject;
      try {
        reqBodyObject = JSON.parse(reqBodyString);
      } catch (err) {
        // we can just continue and attempt to pass the string
      }

      let status = 200;
      let body = '';

      try {
        const options = {
          data: reqBodyObject ? reqBodyObject : reqBodyString,
        };
        const client = new Shopify.Clients.Graphql(shopName, token);
        const response = await client.query(options);
        body = response.body;
      } catch (err) {
        switch (err.constructor.name) {
          case 'MissingRequiredArgument':
            status = 400;
            break;
          case 'HttpResponseError':
            status = err.code;
            break;
          case 'HttpThrottlingError':
            status = 429;
            break;
          default:
            status = 500;
        }
        body = err.message;
      } finally {
        ctx.res.statusCode = status;
        ctx.res.end(JSON.stringify(body));
      }
      return resolve();
    });
  });
  return promise;
}

module.exports = {
  ApiVersion,
  graphqlProxy
}
