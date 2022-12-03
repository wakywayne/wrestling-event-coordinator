import { useQuery, gql, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';

export default function DisplayCarts() {
    const [cartId, setCartId] = useState("");
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);

    interface Cart {
        id: string;
        items: string[];
    }


    // IMPORTANT NOTE when updating the cache of a query you must return the same fields as the original query even if you aren't using them in the code


    const GET_CARTS = gql`
query  CartsQueryBull{
carts{
id
items{
id
name
}}} `;


    const MUTATION = gql`
  mutation AddItem($input:MutationAddItemInput!) {
    addItem(input: $input){
            items{
                id
                name
            }
        }
    }
`;


    const { loading, error, data } = useQuery(GET_CARTS)

    const [addItem] = useMutation(MUTATION, {

        // refetchQueries: [{ query: GET_CARTS }]


        update(cache, { data: { addItem } }) {
            // addItem is the response of the query of add item function         
            console.log({ addItem });
            // @ts-ignore
            let { carts } = cache.readQuery({ query: GET_CARTS });

            console.log({ carts })

            //   make a new array out of the carts array and add the new item to the array if the id of the cart is 2
            let newCarts = carts.map((cart: Cart) => {
                if (cart.id === "1") {
                    return { ...cart, items: [...addItem.items] }

                } else {
                    return cart
                }
            })


            console.log({ newCarts });

            cache.writeQuery({
                query: GET_CARTS,
                data: { carts: newCarts }
                // data: { carts: [{ id: "1", items: [{ id: "2", name: "an item" }] }] }
            })
        }
    })



    function AddTodo() {
        let theInput = {
            cartId,
            id,
            name,
            price,
            quantity
        }

        let req = JSON.stringify(theInput);
        // @ts-ignore
        addItem({ variables: { input: theInput } });
        console.log("Added Item");
    };


    return (
        <div className='m-5 '>

            <h1 className='text-center '>Display Carts</h1>
            {/* Make a form that takes in 5 inputs */}
            <form className='flex flex-col items-center bg-slate-400'>
                <label htmlFor="cartId">Cart Id</label>
                <input type="text" name="cartId" id="cartId" value={cartId} onChange={(e) => setCartId(e.target.value)} />
                <label htmlFor="id">Item Id</label>
                <input type="text" name="id" id="id" value={id} onChange={(e) => setId(e.target.value)} />
                <label htmlFor="name">Item Name</label>
                <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                <label htmlFor="price">Item Price</label>
                <input type="number" name="price" id="price" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                <label htmlFor="quantity">Item Quantity</label>
                <input type="number" name="quantity" id="quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                <button type="button" onClick={AddTodo}>Add Item</button>
            </form>

            {loading && <p className=''>Loading...</p>}
            {error && <p className=''>Error :(</p>}
            <div className="flex">

                {data && data.carts.map((cart: any) => (
                    <div key={cart.id} className='p-4 bg-amber-400'>
                        <p className=''>Cart number {cart.id}</p>
                        <div className='bg-blue-300 '>{cart.items.map((item: any) => (
                            <><span key={item.name}>{item.name}</span><br /></>
                        ))}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}