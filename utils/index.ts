export const errorIfPromiseFalse = async (theFunction: Promise<any>, message: string) => {

    const result = await theFunction;
    if (!result) {
        throw new Error(message);
    } else {
        return result;
    }
}

// @todo add this to blog it removes any keys that are undefined or null
export const cleanUndefinedOrNullKeys = (obj: Object) => (
    Object.fromEntries(
        Object.entries(obj).filter(([k, v]) => v != null || v != undefined)
    ));