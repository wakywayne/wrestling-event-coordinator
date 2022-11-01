export const errorIfPromiseFalse = async (theFunction: Promise<any>, message: string) => {

    const result = await theFunction;
    if (!result) {
        throw new Error(message);
    } else {
        return result;
    }
}


