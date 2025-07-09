const jwt = require("jsonwebtoken");


module.exports = function(req,res,next){
    const authHeader = req.headers["authorization"];
     const token = authHeader && authHeader.split(" ")[1];
// const token = req.headers("Authorization")?.split("")[1];
if (!token) return res.status(401).json({messageL: "No Token"});

try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
}catch(error){

    res.status(401).json({message:"Invalid Token"});


}







};