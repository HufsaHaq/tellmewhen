/*
This file outlines the handling of authentication for JWT tokens.
 */
const jwt = require('jsonwebtoken');

const authMiddleWare = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  //check the header 
  if(!authHeader || !authHeader.startsWith("Bearer")){
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(' ')[1]; // extact the token from the header

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  }catch(err){
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authMiddleWare;