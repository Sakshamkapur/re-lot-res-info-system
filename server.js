var express= require("express");
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var mongoose = require('mongoose');
var users = express.Router();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bcrypt = require('bcryptjs');
const saltRounds = 5;
var jwt = require('jsonwebtoken');
var token;
process.env.SECRET_KEY='sak';

var app = express();
var ObjectId = require('mongoose').ObjectID;
app.set('views', __dirname + '/views');
app.use('/assets', express.static('assets'));



// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_id',
    secret: 'sak',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

app.use((req, res, next) => {
    if (req.cookies.user_id && !req.session.user) {
        res.clearCookie('user_id');        
    }
    next();
});

var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_id) {
        next();
    } else {
       res.redirect('/');
    }    
};

function loggedIn(req, res, next) {
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, function(err) {
      next();
    });
  }else{
    res.redirect('/');
  }
}



var Uconnect = mongoose.createConnection('mongodb://dev:dev123@ds249873.mlab.com:49873/users',{
    useNewUrlParser: true
});
var Pconnect = mongoose.createConnection('mongodb://dev:dev123@ds135726.mlab.com:35726/properties',{
    useNewUrlParser: true
});
var Cconnect = mongoose.createConnection('mongodb://dev:dev123@ds145346.mlab.com:45346/clients',{
    useNewUrlParser: true
});

var UserSchema = new mongoose.Schema({
   email: { type : String },
   password: {type : String}
});
var PropertySchema = new mongoose.Schema({
   site_name: { type : String },
   location: {type : String},
   house_model_info: {type : String},
   house_unit_info: {type : String},
   created_on: {type : String}
});
var ClientSchema = new mongoose.Schema({
   name: { type : String },
   email: {type : String},
   company: {type : String},
   payment: {type : String},
   site_id: {type : String},
   percent: {type: Number}
});

var User = Uconnect.model('User', UserSchema);
var Property = Uconnect.model('Property', PropertySchema);
var Client = Cconnect.model('Client', ClientSchema);


app.get('/create/properties',loggedIn,sessionChecker,function(req,res){
    res.render('create_properties.ejs');
});
app.get('/create/client',loggedIn,sessionChecker,function(req,res){
    res.render('create_client.ejs');
});

app.get('/properties_list/',loggedIn,sessionChecker, function(req,res){
  Property.find({}, function(err, data){
      if (err) return callback(err);
      res.render('properties.ejs',{row: data,auth: req.session.user});
  });
});

app.get('/client_list/',loggedIn,sessionChecker, function(req,res){
  var parr = [];
  Client.find({}, function(err, data){
      if (err) return callback(err);
      for(var i=0;i<data.length;i++){
        Property.find({_id: mongoose.Types.ObjectId(data[i].site_id)}, function(err, pdata){
            if (err) return callback(err);
            console.log(pdata[0]);
            parr.push(pdata[0]);
            console.log(parr);
        });
      }
      setTimeout(function(){ 
        console.log("==>",parr);
        res.render('clients.ejs',{row: data,prow: parr,auth: req.session.user});
      }, 1500);
  });
});
app.post('/view',urlencodedParser, function (req, res) {
  console.log(req.body);
  d={ site_name: req.body.site_name,
      location: req.body.location,
      house_model_info: req.body.house_model_info,
      house_unit_info: req.body.house_unit_info,
      created_on: req.body.created_on
  };
  console.log(d);
  var newProperty = Property(d).save(function(err,data){
    if(err) throw err;
    res.json(data);
  });
});

app.post('/view/client',urlencodedParser, function (req, res) {
  console.log(req.body);
  var newClient = Client(req.body).save(function(err,data){
    if(err) throw err;
    res.json(data);
  });
});

app.post('/view/update',urlencodedParser,function(req,res){
    var id = req.body['id'];
    delete req.body['id'];
    Property.update({_id: mongoose.Types.ObjectId(id)},{$set: req.body},function(err, data) {
        if (err) throw err;
           res.json(data);
    });       
});
app.delete('/view/:id',function(req,res){
  Property.find({_id: req.params.id}).remove(function(err, data){
     if (err) throw err;
      res.json(data);
  });
});

app.post('/view/client/update',urlencodedParser,function(req,res){
    var id = req.body['id'];
    delete req.body['id'];
    Client.update({_id: mongoose.Types.ObjectId(id)},{$set: req.body},function(err, data) {
        if (err) throw err;
           res.json(data);
    });       
});
app.delete('/view/client/:id',function(req,res){
  Client.find({_id: req.params.id}).remove(function(err, data){
     if (err) throw err;
      res.json(data);
  });
});

// register post
app.post('/register_details',urlencodedParser,function(req,res){
    bcrypt.hash(req.body.pass, saltRounds, function(err, hash) {
      var userData = {
       email: req.body.email,
       password: hash
      };
      var newUser = User(userData).save(function(err, data) {
        if(err) throw err;
        req.session.user = data;
        res.json(data);
      });
    });
});
// login post
app.post('/login_details',urlencodedParser,function(req,res){
    var em = req.body.email;
    var password = req.body.pass;
    var r=res;
    var re=req;
    User.find({email: em}, function(err, data) {
       if (err) throw err;
       var d=data;
        if (data.length > 0) {
          bcrypt.compare(password, data[0].password, function(err, res) {
              if(res==true){
                token = jwt.sign({data: data[0]}, process.env.SECRET_KEY, {
                  expiresIn: 1000
                });
                re.session.user = d;
                r.json({"token": token,"id": data[0].id,"login": true});
              }else{
                r.json({"err": 'password did not match',"login": false});
              }
          });
        }else{
          r.json({"err": 'email not found',"login": false});
        }
    });
});


// logout get
app.get('/logout',function(req,res){
    token=null;
    if (req.session.user && req.cookies.user_id) {
        res.clearCookie('user_id');
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

app.get('/',function(req,res){
  res.render('login.ejs');
});
app.get('*',function(req,res){
  res.redirect('/');
});


app.listen(process.env.PORT || 3000, () => {
    console.log("Server is listening on port 3000");
});