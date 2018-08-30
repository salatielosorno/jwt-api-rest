var express = require('express');
var router = express.Router();
var service = require('../auth/service');
var User =   require('../models/user');
var middleware = require('../auth/middleware');

router.post('/authentication', login);
//To test by postman
router.post('/users', createUser);
router.get('/private', middleware.ensureAuthenticated, whateverYouNeedToDo);

function login(req,res){
    try {
        if(!req.body.email || !req.body.pass)
        return res.status(400).send({message:'Missing data necessary'});

        User.findOne({email:req.body.email}, (err, user)=>{
            if(err)
                return res.status(401).send({message:'Authentication failed. User not found.'});
            
            if(user.pass != req.body.pass)
                return res.status(401).send({message: 'Authentication failed. Wrong password.'})

            var token = service.createToken({ _id:user.id});
            
            return res.status(200).send({message:'This is your token', token: token});
        })
    } catch (error) {
        return res.status(500).send({message:'Something went wrong, We do not know what is but we will try to fix it'});
    }
}
//To test by postmans
function createUser(req,res){
    try {
        var newUser = new User({
            email: req.body.email,
            pass: req.body.pass
        });

        newUser.save((err,user)=>{
            if(err)
                res.status(500).send({message: 'Error during saving'});
            else
                res.status(200).send(user);
        })
    } catch (error) {
        
    }
}
function whateverYouNeedToDo(req,res){
    try {
        res.status(200).send({message:'You are autheticated. UserID:'+req.userID})
    } catch (error) {
        res.status(500).send({message:'Error.'})
    }
}

module.exports = router;