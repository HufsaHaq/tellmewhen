/*
This file outlines the handling of authentication for JWT tokens.
To-Do:

 */
import jwt from 'jsonwebtoken';
import fs from 'fs';

const publicKey = fs.readFileSync('public.pem','utf-8');

const authMiddleWare = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  //check the header 
  if(!authHeader || !authHeader.startsWith("Bearer")){
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(' ')[1]; // extact the token from the header

  try{
    const decoded = jwt.verify(token,publicKey,{ algorithms: ['RS256'] });
    req.user = decoded;
    next();
  }catch(err){
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

const adminMiddleWare = (req, res, next)=>{
  const privilege = req.body.privilege_level;
  if(privilege === 1){
    next();
  }else{
    res.status(401).json({ message: "Unauthorized: Invalid privilege level" });
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