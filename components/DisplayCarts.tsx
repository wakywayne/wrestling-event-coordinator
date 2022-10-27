import { useQuery, gql, useMutation } from '@apollo/client';

export default function DisplayCarts() {

    interface Cart {
        id: string;
        items: string[];
    }

    interface Items {

    }


    // IMPORTANT NOTE when updating the cache of a query you must return the same fields as the original query even if you aren't using them in the code

    const GET_CARTS = gql`
query {
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
                if (cart.id === "2") {
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
            cartId: "2",
            id: "21",
            name: "New Item!",
            price: 1900,
            quantity: 2
        }

        let req = JSON.stringify(theInput);
        // @ts-ignore
        addItem({ variables: { input: theInput } });
        console.log("Added Item");
    };


    return (
        <div>
            <h1 className='text-center '>Display Carts</h1>
            <button onClick={AddTodo}>Click Me</button>
            {loading && <p className=''>Loading...</p>}
            {error && <p className=''>Error :(</p>}
            {data && data.carts.map((cart: any) => (
                <div key={cart.id} className=''>
                    <p className=''>Cart number {cart.id}</p>
                    <div className=''>{cart.items.map((item: any) => (
                        <span key={item.name}>{item.name}</span>
                    ))}</div>
                </div>
            ))}
        </div>
    )
}