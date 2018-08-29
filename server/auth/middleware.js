var jwt = require('jwt-simple');
var moment  = require('moment');
var config =   require('../_config');

exports.ensureAuthenticated = function(req,res,next){
    try {
        if(!req.headers.authorization)
            return res.status(403).send({message:'Error. Access denied'});

        var token = req.headers.authorization.split(" ")[1];
        var payload;

        try{
            payload =  jwt.decode(token, config.TOKEN_SECRET);
        }
        catch(err){
            return res.status(401).send({message: err.message})
        }
        
        req.userID = payload.sub;
        next();
    } catch (error) {
        res.status(500).send({message: error.stack})
    }
}