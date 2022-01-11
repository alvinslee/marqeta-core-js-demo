// FILE: index.js

const send = require('./marqeta-axios.js');

(async () => {
  // LIST ALL USERS
  let result = await send({ endpoint: 'users' });
  const users = result.data;
  // console.log('USERS', users);

  const user = users[0];
  console.log('USER [0]', user);

  // LIST ALL CARDS FOR USER
  result = await send({ endpoint: `cards/user/${user.token}`});
  const cards = result.data;
  console.log('CARDS FOR USER [0]', cards);

  // LIST ALL CARD PRODUCTS
  result = await send({ endpoint: 'cardproducts' });
  const cardProducts = result.data
  console.log('CARD PRODUCTS', cardProducts);

  // RETRIEVE SINGLE CARD PRODUCT
  const cardProductToken = cardProducts[0].token;
  result = await send({ endpoint: `cardproducts/${cardProductToken}` });
  const cardProduct = result;
  console.log('CARD PRODUCT[0]', cardProduct);

  // FIELD FILTERING
  result = await send({ endpoint: '/users?fields=token,first_name' });
  console.log('USERS WITH FIELD FILTERING', result.data);

  // SORTING
  result = await send({ endpoint: '/users?sort_by=lastModifiedTime' });
  console.log('USERS SORTED BY ASCENDING LAST MODIFIED TIME', result.data);

   // REVERSE SORTING
  result = await send({ endpoint: '/users?sort_by=-lastModifiedTime' });
  console.log('USERS SORTED BY DESCENDING LAST MODIFIED TIME', result.data);

/*
IMPORTANT:
If specifying a token for this new user, you will only be able to make
this call once, because tokens must be unique. As an alternative, do not
specify a token, and Marqeta will generate one for you. Use that token
(get it from the result) in subsequent requests.
*/

  // CREATE A USER
  result = await send({
    endpoint: '/users',
    method: 'POST',
    data: {
      token: 'test-user-01',
      first_name: 'Ned',
      last_name: 'Leeds'
    }
  });
  console.log(result);

  // CREATE A FUNDING SOURCE
  // See note above on specifying a token during resource creation.
  result = await send({
    endpoint: '/fundingsources/program',
    method: 'POST',
    data: {
      token:'funding-source-01',
      name:'My Program Funding Source',
      active: true
    }
  });
  console.log(result);

  // CREATE A CARD PRODUCT
  // See note above on specifying a token during resource creation.
  result = await send({
    endpoint: '/cardproducts',
    method: 'POST',
    data: {
      token:'card-product-01',
      name:'My Card Product',
      active: true,
      start_date: '2021-12-01',
      config: {
        card_life_cycle: {
          activate_upon_issue: true
        },
        fulfillment: {
          payment_instrument: 'VIRTUAL_PAN'
        },
        jit_funding: {
          program_funding_source: {
            funding_source_token: 'funding-source-01', 
            enabled: true
          }
        }
      }
    }
  });
  console.log(result);

  // CREATE A CARD
  // See note above on specifying a token during resource creation.
  result = await send({
    endpoint: '/cards',
    method: 'POST',
    data: {
      token:'test-user-01-card-01',
      user_token:'test-user-01',
      card_product_token:'card-product-01'
    }
  });
  console.log(result);

  // UPDATE A USER
  result = await send({
    endpoint: '/users/test-user-01',
    method: 'PUT',
    data: {
      first_name: 'Edward',
      middle_name: 'Ned',
      state: 'New York'
    }
  });
  console.log(result);

  // SIMULATE A TRANSACTION
  result = await send({
    endpoint: '/simulate/authorization',
    method: 'POST',
    data: {
      card_token: 'test-user-01-card-01',
      amount: 49.99,
      mid: 'merchant-01'
    }
  });
  console.log(result);

  // RETRIEVE A BALANCE
  result = await send({ endpoint: '/balances/test-user-01' });
  console.log(result);

})();
