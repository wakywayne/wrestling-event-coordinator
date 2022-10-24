import type { NextApiRequest, NextApiResponse } from 'next'

interface reqUser {
    user: string;
}

type Override<T1, T2> = Omit<T1, keyof T2> & T2;

type overRideRequest = Override<NextApiRequest, { query: reqUser }>

const handler = async (req: overRideRequest, res: NextApiResponse) => {
    let { user } = req.query;


    let newObj = Buffer.from(user, 'base64').toString()
    console.log({ newObj })
    res.status(200).json(newObj);
}

export default handler
