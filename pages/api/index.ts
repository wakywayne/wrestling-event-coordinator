import { createServer } from '@graphql-yoga/node'
import SchemaBuilder from "@pothos/core"


type CartItem = {
    id: string
    name: string
    price: number
    quantity: number
}

type Cart = {
    id: string
    items?: CartItem[]
}


const builder = new SchemaBuilder<{
    Objects: {
        Cart: Cart
        CartItem: CartItem
    };

    Scalars: {
        ID: { Input: string, Output: string }
    };
}>({});

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

builder.objectType('Cart', {
    fields: (t) => ({
        id: t.exposeString('id'),
        items: t.field({
            type: ['CartItem'],
            resolve: (cart) => cart.items ?? [],
        }),
    }),
})

builder.objectType('CartItem', {
    fields: (t) => ({
        id: t.exposeID('id'),
        name: t.exposeString('name'),
        price: t.exposeInt('price'),
        quantity: t.exposeInt("quantity"),
    }),
})

builder.queryType({
    fields: (t) => ({
        cart: t.field({
            nullable: true,
            args: {
                id: t.arg.id({ required: true, description: "the id of the cart" }),
            },
            type: 'Cart',
            resolve: (_, { id }) => {
                const cart = CARTS.find((cart) => cart.id === id);

                if (!cart) {
                    throw new Error(`Cart with id ${id} not found`)
                }

                return cart
            }
        }),
    }),
})


const server = createServer({
    endpoint: '/api',
    schema: builder.toSchema(),
})



// const books = [{
//     id: 1,
//     title: "Fullstack tutorial for GraphQL",
//     pages: 356
// }, {
//     id: 2,
//     title: "Introductory tutorial to GraphQL",
//     chapters: 10
// }, {
//     id: 3,
//     title: "GraphQL Schema Design for the Enterprise",
//     pages: 550,
//     chapters: 25
// }];

// type Book = {
//     id: Int!
//     title: String
//     pages: Int
//     chapters: Int
// }

// type Query = {
//     books: [Book!]
//     book(id: Int!): Book
// }





// const resolvers = {
//     Query: {
//         books: function (parent, args, context, info) {
//             return [{ id: 1, title: "Fullstack tutorial for GraphQL", pages: 356 }, { id: 2, title: "Introductory tutorial to GraphQL", chapters: 10 },];
//         },
//         book: (parent, args, context, info) => books.find(e => e.id === args.id)
//     },
//     Book: {
//         id: parent => parent.id,
//         title: parent => parent.title,
//         pages: parent => parent.pages,
//         chapters: parent => parent.chapters
//     }
// };




// const apolloServer = new ApolloServer({ typeDefs, resolvers, introspection: true, plugins: pluginOnDevOnly })


// const startServer = apolloServer.start()



// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
// export default async function handler(req, res) {
// await startServer;

// await apolloServer.createHandler({
//     path: '/api/graphql',
// })(req, res)
// }





// export const config = {
//     api: {
//         bodyParser: false,
//     },
// }

export default server;