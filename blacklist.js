/*
This file defines how compromised tokens are to be handled.
Methods:
- blackListToken (token:String): Takes in a token to be added to the 'black-list'. Returns None
- checkToken (token:String): Checks whether a token has been black-listed. Returns a boolean value
 */

//imports
import { addToken, getTokenStatus, blockToken, closeDB} from "./dbhelper.js";

//Check if a token has been blacklisted
export const checkToken = async(token) =>{
    //Look up token in DB
    let result;
    try{
    result = await getTokenStatus(token);
    }catch (err){
        throw new Error(`Error whilst looking up token in db: ${err}`)
    }
    //check if token is still valid: 
    return (result === 1);
}
//Appends a token to blacklisted to the db
export const blackListToken = async(token) => {
    try{
        await blockToken(token);
    }catch (err) {
        throw new Error(`BlacklistError: ${err}`);
    }
    
}