import type { NextApiRequest, NextApiResponse } from 'next'
import type { Override } from "types";

interface reqUser {
    user: string;
}


type overRideRequest = Override<NextApiRequest, { query: reqUser }>

const handler = async (req: overRideRequest, res: NextApiResponse) => {
    let { user } = req.query;


    // let objJsonB64 = Buffer.from(JSON.stringify(SMilePlease)).toString("base64");

    let newObj = Buffer.from(user, 'base64').toString()
    console.log({ newObj });
    res.status(200).json(newObj);
}

export default handler
