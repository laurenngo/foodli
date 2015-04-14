var express = require('express');
var session = require ("express-session");
var bodyParser = require('body-parser');
var recipesCtrl = require('./controllers/recipes')
var bcrypt = require('bcrypt')
var flash = require('connect-flash');
var app = express();
var db=require("./models");


//load middleware
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
  secret:'penguins',
  resave:false,
  saveUninitialized: true
}));
app.use(flash());

//load controllers
app.use("/recipes", recipesCtrl);

app.get("/", function(req,res){
  res.render("index");
})

app.post("/signup", function(req,res){
  var userSignup ={email:req.body.email,
                   username:req.body.username,
                   password:req.body.password
                 };

  db.user.findOrCreate({where:{email:req.body.email}, defaults:userSignup})
  .spread(function(user,created){
     if(created){
        res.send('New user created.');
      } else {
        res.send('e-mail already exists.');
      }
  })
     .catch(function(error){
      console.log('ERROR',error);
      res.send(error);
     })
  res.redirect("/")


})

app.post("/login", function(req,res){
  db.user.find({where:{username:req.body.username}})
  .then(function(user){
    // res.send(user)
    if(user){
      bcrypt.compare(req.body.password, user.password,function(err,result){
        if(err) {throw err;}
        // res.send(req.body.password)

        if(result){
          req.session.user= {
            id:user.id,
            email:user.email,
            username:user.username
          };
          // res.send("Logged in!")
          res.redirect("/")
        } else {
          // res.send("Sorry, nope!")
        }
      })
    } else {
      // res.send("Unknown user. Sign up!")
    }
  })

// res.send(req.body.password)
})


app.get("/mylists", function(req,res){
  res.render("my-lists")
})


app.get("/additem", function(req,res){
  res.render("add-item");
})


app.get("/starlist", function(req,res){
  res.render("star-list");
})


app.get("/myrecipes", function(req,res){
  res.render("my-recipes")
})

app.get("/about", function(req,res){
  res.render("about-contact")
})


app.listen(3002,function(){
  console.log("Let's do this thing!")
})