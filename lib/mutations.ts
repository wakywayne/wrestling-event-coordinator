import { ObjectId } from 'bson';
import { User, Event as Events } from 'gql';
import clientPromise from 'lib/mongodb';


const createUser = async (user: User): Promise<ObjectId | undefined> => {

    try {
        const client = await clientPromise;
        const db = client.db();

        const newUser = await db
            .collection("users")
            .insertOne(user);
        // return the created users id
        const returnedId: ObjectId = newUser.insertedId;

        if (newUser) {
            return returnedId;
        } else {
            throw new Error("User not created");
        }
    } catch (e) {
        console.error(e);
    }
}

const dbMutations = {
    createUser
}

export default dbMutations;
