const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || 'h0yewb-uk.myshopify.com';
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

const endpoint = `https://${domain}/api/2024-10/graphql.json`;

interface ShopifyResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json: ShopifyResponse<T> = await response.json();

  if (json.errors) {
    console.error('Shopify API errors:', json.errors);
    throw new Error(json.errors[0].message);
  }

  return json.data;
}

// Create a cart and return checkout URL
export async function createCheckout(variantId: string, quantity: number = 1) {
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lines: [
        {
          merchandiseId: `gid://shopify/ProductVariant/${variantId}`,
          quantity,
        },
      ],
    },
  };

  const data = await shopifyFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: Array<{ code: string; field: string[]; message: string }>;
    };
  }>(query, variables);

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  const cart = data.cartCreate.cart;
  if (!cart) return null;

  return { webUrl: cart.checkoutUrl };
}

// Get product by handle (slug)
export async function getShopifyProduct(handle: string) {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        availableForSale
        variants(first: 1) {
          edges {
            node {
              id
              price {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    product: {
      id: string;
      title: string;
      handle: string;
      availableForSale: boolean;
      variants: {
        edges: Array<{
          node: {
            id: string;
            price: { amount: string; currencyCode: string };
            availableForSale: boolean;
          };
        }>;
      };
    } | null;
  }>(query, { handle });

  return data.product;
}

// Extract variant ID from Shopify GID
export function extractVariantId(gid: string): string {
  // gid://shopify/ProductVariant/123456789 -> 123456789
  const parts = gid.split('/');
  return parts[parts.length - 1];
}
