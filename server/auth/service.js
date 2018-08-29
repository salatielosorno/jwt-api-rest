var jwt = require('jwt-simple');
var moment  = require('moment');
var config = require('../_config');

exports.createToken  =  (user)=>{
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(config.expTime.duration, config.expTime.unit).unix(),
        role: 1
    }
    return jwt.encode(payload, config.TOKEN_SECRET);
}