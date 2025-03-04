/*
This file outlines the handling of authentication for JWT tokens.
To-Do:
Test authentication with JWT tokens
 */
import jwt from 'jsonwebtoken';
import fs from 'fs';

const publicKey = fs.readFileSync('jwtRSA256-public.pem','utf-8');

const authMiddleWare = (req, res, next) => {
  //check that authorisation token is present in cookies
  if(req.cookies?.access){
    const token = req.cookie.access

    jwt.verify(token,publicKey,{ algorithms: ['RS256'] },
      (err,decoded) =>{ 
        if(err){
          return res.status(400).json({ message:`Unable to verify token: ${err}`})
        }else{
          req.user = decoded;
          next();
        }
        })
  }else{
    return res.status(401).json( {message:'No token provided'})
  }
};

const adminMiddleWare = (req, res, next)=>{
  //passed from previous middleware
  const privilege = req.body.privilege_level;
  if(privilege != null){
  if(privilege === 1){
    next();
  }else{
    res.status(401).json({ message: "Unauthorized: Invalid privilege level" });
  }
  }else{
    return res.status(401).json({ message: "Unauthorized: No privilige level assigned"})
  }
}

const moderatorMiddleWare = (req, res, next)=>{
  const privilege = req.body.privilege_level;
  if(privilege === 2 || privilege === 1){
    next();
  }else{
    res.status(401).json({ message: "Unauthorized: Invalid privilege level" });
  }
}
export { authMiddleWare, moderatorMiddleWare, adminMiddleWare};