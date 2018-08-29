var User = require('../server/models/user');
var app = require('../server/app');
var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

describe('Test authentication using JWT', function() {
    beforeEach((done)=>{
        var newUser = new User({
            email: 'salatiel@domain.com',
            pass: '12345'
        });
        newUser.save((err)=>{
            done();
        });
    })
    afterEach((done)=>{
        User.collection.drop();
        done();
    })
    it('Should return a JWT on /authentication', (done)=>{
        chai.request(app)
        .post('/authentication')
        .send({
            email: 'salatiel@domain.com',
            pass: '12345'
        })
        .end((err,res)=>{
            res.should.be.json;  
            res.should.have.status(200);
            res.body.should.have.a.property('message');
            res.body.should.have.a.property('token');
            
            res.body.message.should.be.a('string');
            res.body.token.should.be.a('string');

            res.body.message.should.be.equals('This is your token');
            done();
        })
    })
    it('Should allow to access to a private URL on /private - GET', (done)=>{
        chai.request(app)
        .post('/authentication')
        .send({
            email: 'salatiel@domain.com',
            pass: '12345'
        })
        .end((err,res)=>{
            chai.request(app)
            .get('/private')
            .set('Authorization', 'Bearer '+res.body.token)
            .end((err,res)=>{
                res.should.be.json;
                res.should.have.status(200);
                res.body.should.have.a.property('message');
                
                done();
            })
        })
    })
    it('Should return Token expired on /private - GET', (done)=>{
        chai.request(app)
        .post('/authentication')
        .send({
            email: 'salatiel@domain.com',
            pass: '12345'
        })
        .end((err,res)=>{
            setTimeout(() => {
                chai.request(app)
                .get('/private')
                .set('Authorization', 'Bearer '+res.body.token)
                .end((err,res)=>{
                    res.should.be.json;
                    res.should.have.status(401);
                    res.body.should.have.a.property('message');
                    done();
                })
            }, 1000);
        })
    })
});