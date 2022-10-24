import type { NextApiRequest, NextApiResponse } from 'next'
import type { Override } from "types";

interface reqUser {
    user: string;
}


type overRideRequest = Override<NextApiRequest, { query: reqUser }>

const handler = async (req: overRideRequest, res: NextApiResponse) => {
    let { user } = req.query;


    let newObj = Buffer.from(user, 'base64').toString()
    res.status(200).json(newObj);
}

export default handler
