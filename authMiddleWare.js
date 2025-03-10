/*
This file outlines the handling of authentication for JWT tokens.
To-Do:
Test authentication with JWT tokens
 */
import jwt from 'jsonwebtoken';
import fs from 'fs';

const publicKey = fs.readFileSync('jwtRSA256-public.pem','utf-8');

const authMiddleWare = async(req, res, next) => {
    //check that authorisation token is present in cookies
    if(req.cookies?.access){
        const token = req.cookies.access

        await jwt.verify(token,publicKey,{ algorithms: ['RS256'] },
            (err,decoded) =>{ 
            if(err){
                return res.status(400).json({ message:`Unable to verify token: ${err}`})
            }else{
                req.user = decoded;
                next();
            }
            })
    }else{

        return res.status(401).json( {message:'No token provided'});

    }
}

const adminMiddleWare = (req, res, next)=>{
    //passed from previous middleware
    const role = req.user.role; // role not privilige !
    if(role != null){
        if(role === 1){
            next();
        }else{

            return res.status(401).json({ message: "Unauthorized: Invalid privilege level" });

        }
    }else{
        
        return res.status(401).json({ message: "Unauthorized: No privilige level assigned"});

        }
    }

const moderatorMiddleWare = (req, res, next)=>{
    const role= req.user.role;
    if(role === 2 || role === 1){
        next();
    }else{
        return res.status(401).json({ message: "Unauthorized: Invalid privilege level" });
    }
}
export { authMiddleWare, moderatorMiddleWare, adminMiddleWare};