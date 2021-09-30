# koa-shopify-graphql-proxy-cookieless

This is a fork of the Shopify quilt package https://github.com/Shopify/quilt/blob/master/packages/koa-shopify-graphql-proxy/README.md

This is not sponsored or endorsed by Shopify, or connected with Shopify in any way.

I'm providing this package as a reference for using with Shopify's Next Gen JWT-based Cookieless Auth.

# Important
This is a near drop-in replacement for the official koa-shopify-graphql-proxy package, but make sure you don't 
import graphQLProxy as default, and use named imports instead:

```
import { graphqlProxy, ApiVersion } from "koa-shopify-graphql-proxy-cookieless";
```

NOTE: ApiVersion is provided here as a convenience, but will probably be removed
in later versions. You can get the ApiVersion enum from Shopify's Node Api package like this:

```
import Shopify, { ApiVersion } from '@shopify/shopify-api'; 
```

# Example
Here's the basic example:

```
router.post(
    "/graphql",
    // verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      // We are pulling the shop from the decoded JWT fields
      // The shop param will not be accessible if JWT is invalid
      // NOTE: You will need to use verifyJwtSessionToken from the 
      // koa-shopify-auth-cookieless package
      // If you do not choose to use this library, you can decode 
      // the JWT with any other method you'd like, pulling the shop
      // parameter, and also verifying exp
      const shop = await verifyJwtSessionToken(ctx, next, Shopify.Context);
      // retrieve your access token here
      const accessToken = "persistedAccessToken"; 
      await graphqlProxy(shop, accessToken, ctx);
    }
  );
```

# IMPORTANT
You will need to have initialized the Shopify Context beforehand like this:

```
Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.April21,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  // We are not using any session
  SESSION_STORAGE: null
});
```

# NOTE:
This version is updated to use the Shopify Node Api package internally,
and this has created a simpler and more streamlined usage of Shopify's
own graphQl client.


# See Working Demo
I've created a working demo based on the Shopify-CLI Node project.  
<https://github.com/nprutan/shopify-cookieless-auth-demo>  
If you'd like to see this in action, create a new Shopif-CLI project,
and also clone the demo repo. Once you've cloned the demo, you can connect
an existing Shopify project to the demo. Open a terminal in the 
demo directory and use the command:
```shopify connect```

