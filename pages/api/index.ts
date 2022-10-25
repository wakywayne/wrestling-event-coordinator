import { createServer } from '@graphql-yoga/node'
import SchemaBuilder from "@pothos/core"
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import WithInputPlugin from "@pothos/plugin-with-input"
import { CartItem, Cart, Money, User } from 'gql';
import axios from 'axios';
import { apiUrl } from '@/config/index';
import { ConnectionCheckOutFailedEvent } from 'mongodb';


const CARTS = [
    {
        id: '1',
        items: [
            {
                id: '1',
                name: 'Item 1',
                price: 10,
                quantity: 1
            },
            {
                id: '2',
                name: 'Item 2',
                price: 20,
                quantity: 2
            }
        ]
    },
    {
        id: '2',
        items: [
            {
                id: '3',
                name: 'Item 3',
                price: 30,
                quantity: 3
            },
            {
                id: '4',
                name: 'Item 4',
                price: 40,
                quantity: 4
            }
        ]
    }
]

const fetchUser = async (url: string) => {
    try {
        const response = await axios(url);
        const data = response.data;
        return data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(error.response?.data);
        } else {
            console.log(error);
        }
    }
}

const builder = new SchemaBuilder<{
    Context: {
        currentUser: User;
    }

    AuthScopes: {
        public: boolean,
        user: boolean,
        admin: boolean,
    }
}>({
    plugins: [
        ScopeAuthPlugin,
        WithInputPlugin
    ],
    authScopes: async (context) => ({
        public: true,
        // eagerly evaluated scope
        user: context.currentUser.id === '1',
        // user: context.currentUser ? context.currentUser.id === '1' : false,
        // user: false,
        // evaluated when used 
        admin: false
        // scope loader with argument
    }),
    withInput: {
        typeOptions: {
            // default options for Input object types created by this plugin
        },
        argOptions: {
            // set required: false to override default behavior
        },
    },
});





builder.objectType(User, {
    name: 'User',
    fields: (t) => ({
        id: t.exposeID('id', {}),
        name: t.exposeString('name', {}),
        email: t.exposeString('email', {}),
    }),
});



builder.objectType(Cart, {
    name: "Cart",
    description: "A cart",
    fields: (t) => ({
        id: t.exposeString('id', {}),
        items: t.field({
            type: [CartItem],
            resolve: (cart) => cart.items ?? [],
        }),
        // This is the field that we want to USE TO REFERENCE
        subTotal: t.field({
            type: Money,
            resolve: (cart) => {
                const total = cart.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0;
                return new Money(total, `$${total}`);
            }
        })
    }),
});



builder.objectType(CartItem, {
    name: "CartItem",
    description: "A cart item",
    fields: (t) => ({
        id: t.exposeString('id', {}),
        name: t.exposeString('name', {}),
        price: t.exposeInt('price', {}),
        quantity: t.exposeInt('quantity', {}),
        lineTotal: t.field({
            type: "Int",
            resolve: (item) => item.price * item.quantity,
        }),
        unitTotal: t.field({
            type: "Int",
            resolve: (item) => item.price,
        })
    }),
});



builder.objectType(Money, {
    name: "Money",
    description: "A money",
    fields: (t) => ({
        amount: t.exposeInt("amount", {}),
        formatted: t.field({
            type: "String",
            resolve: (money) =>
                new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(money.amount),
        }),
    }),
});





builder.queryType({
    fields: (t) => ({
        cart: t.field({
            authScopes: {
                user: true,
            },
            type: Cart,
            nullable: true,
            args: {
                id: t.arg.id({ required: true, description: "the id of the cart" }),
            },
            resolve: (_, { id }) => {
                const cart = CARTS.find((cart) => cart.id === id);

                if (!cart) {
                    throw new Error(`Cart with id ${id} not found`)
                }

                return cart
            }
        }),
        carts: t.field({
            type: [Cart],
            resolve: () => CARTS
        }),
        currentUser: t.field({
            type: User,
            resolve: (root, args, context) => {
                console.log({ theContext: context.currentUser });
                return context.currentUser;
            }
        }),
    }),
})





builder.mutationType({
    fields: (t) => ({
        addItem: t.fieldWithInput({
            input: {
                cartId: t.input.string({ required: true }),
                id: t.input.string({ required: true }),
                name: t.input.string({ required: true }),
                price: t.input.int({ required: true }),
                quantity: t.input.int({ required: true, defaultValue: 1 }),
            },
            type: Cart,
            resolve: (_, { input: { cartId, ...input } }) => {
                const cart = CARTS.find((cart) => cart.id === cartId);

                if (!cart) {
                    throw new Error(`Cart with id ${cartId} not found`)
                }

                return {
                    id: cartId,
                    items: [...cart?.items, input]
                }
            }
        }),
    }),
})





const server = createServer({
    endpoint: '/api',
    schema: builder.toSchema(),
    context: async ({ req }) => {

        if (req.headers.user) {
            const user = await fetchUser(`${apiUrl}/api/auth/return/${req.headers.user}`);
            const parsedUser = JSON.parse(user);

            return {
                currentUser: parsedUser.currentUser
            }
        } else {
            null
        }
    }
})


export default server;