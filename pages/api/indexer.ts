// import { createServer } from '@graphql-yoga/node'
// import SchemaBuilder from "@pothos/core"
// import WithInputPlugin from "@pothos/plugin-with-input"
// import { CartItem, Cart, Money } from 'gql';


// const CARTS = [
//     {
//         id: '1',
//         items: [
//             {
//                 id: '1',
//                 name: 'Item 1',
//                 price: 10,
//                 quantity: 1
//             },
//             {
//                 id: '2',
//                 name: 'Item 2',
//                 price: 20,
//                 quantity: 2
//             }
//         ]
//     },
//     {
//         id: '2',
//         items: [
//             {
//                 id: '3',
//                 name: 'Item 3',
//                 price: 30,
//                 quantity: 3
//             },
//             {
//                 id: '4',
//                 name: 'Item 4',
//                 price: 40,
//                 quantity: 4
//             }
//         ]
//     }
// ]

// const builder = new SchemaBuilder({
//     plugins: [
//         WithInputPlugin
//     ],
//     withInput: {
//         typeOptions: {
//             // default options for Input object types created by this plugin
//         },
//         argOptions: {
//             // set required: false to override default behavior
//         },
//     },
// });



// builder.objectType(Cart, {
//     name: "Cart",
//     description: "A cart",
//     fields: (t) => ({
//         id: t.exposeString('id', {}),
//         items: t.field({
//             type: [CartItem],
//             resolve: (cart) => cart.items ?? [],
//         }),
//         // This is the field that we want to USE TO REFERENCE
//         subTotal: t.field({
//             type: Money,
//             resolve: (cart) => {
//                 const total = cart.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0;
//                 return new Money(total, `$${total}`);
//             }
//         })
//     }),
// });



// builder.objectType(CartItem, {
//     name: "CartItem",
//     description: "A cart item",
//     fields: (t) => ({
//         id: t.exposeString('id', {}),
//         name: t.exposeString('name', {}),
//         price: t.exposeInt('price', {}),
//         quantity: t.exposeInt('quantity', {}),
//         lineTotal: t.field({
//             type: "Int",
//             resolve: (item) => item.price * item.quantity,
//         }),
//         unitTotal: t.field({
//             type: "Int",
//             resolve: (item) => item.price,
//         })
//     }),
// });



// builder.objectType(Money, {
//     name: "Money",
//     description: "A money",
//     fields: (t) => ({
//         amount: t.exposeInt("amount", {}),
//         formatted: t.field({
//             type: "String",
//             resolve: (money) =>
//                 new Intl.NumberFormat("en-US", {
//                     style: "currency",
//                     currency: "USD",
//                 }).format(money.amount),
//         }),
//     }),
// });





// builder.queryType({
//     fields: (t) => ({
//         cart: t.field({
//             type: Cart,
//             nullable: true,
//             args: {
//                 id: t.arg.id({ required: true, description: "the id of the cart" }),
//             },
//             resolve: (_, { id }) => {
//                 const cart = CARTS.find((cart) => cart.id === id);

//                 if (!cart) {
//                     throw new Error(`Cart with id ${id} not found`)
//                 }

//                 return cart
//             }
//         }),
//         carts: t.field({
//             type: [Cart],
//             resolve: () => CARTS
//         }),
//     }),
// })





// builder.mutationType({
//     fields: (t) => ({
//         addItem: t.fieldWithInput({
//             input: {
//                 cartId: t.input.string({ required: true }),
//                 id: t.input.string({ required: true }),
//                 name: t.input.string({ required: true }),
//                 price: t.input.int({ required: true }),
//                 quantity: t.input.int({ required: true, defaultValue: 1 }),
//             },
//             type: Cart,
//             resolve: (_, { input: { cartId, ...input } }) => {
//                 const cart = CARTS.find((cart) => cart.id === cartId);

//                 if (!cart) {
//                     throw new Error(`Cart with id ${cartId} not found`)
//                 }

//                 return {
//                     id: cartId,
//                     items: [...cart?.items, input]
//                 }
//             }
//         }),
//     }),
// })


// const server = createServer({
//     endpoint: '/api',
//     schema: builder.toSchema(),
// })


// export default server;