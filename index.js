var express = require('express');
var session = require ("express-session");
var bodyParser = require('body-parser');
var recipesCtrl = require('./controllers/recipes');
var favoritesCtrl = require('./controllers/favorites')
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

//custom middleware - is user logged in
app.use(function(req,res,next){
  req.session.user = {
    id: 9,
    lists: [{id: 2}]
  }
  req.getUser=function(){
    return req.session.user || false;
  }
  next();
})

app.get('*', function(req,res,next){
  res.locals.currentUser=req.getUser();
  next();
});


app.get('/testing',function(req,res){
  var user = req.getUser();
  res.send(user);
});

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
        console.log('New user created.');
        user.createList({listName:user.username+"'s List", userId:user.id})
        .then(function(list){
          res.redirect("/")
        });
      } else {
        console.log('E-mail already exists.');
      }
  })
     .catch(function(error){
      console.log('ERROR',error);
      res.send(error);
     })


})

app.post("/login", function(req,res){
  db.user.find({where:{username:req.body.username},include:[db.list]})
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
            username:user.username,
            lists:user.lists
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

//GET /auth/logout
//logout logged in user
app.get('/logout',function(req,res){
    delete req.session.user;

    res.redirect('/');

    // res.send('logged out');
});

//GET /restricted
//an example restricted page
app.get('/restricted',function(req,res){
  if(req.getUser()){
    // res.render('main/restricted');
    // res.send(req.getUser)
    res.send("Working!")
  } else {
    // req.flash('danger','You must be logged in to access this page.');
    // res.redirect('/');
    res.send("Error")
  }
});









app.get("/mylists", function(req,res){
  res.render("my-lists")
})


app.get("/list", function(req,res){

  var user=req.getUser();

  db.ingredient.findAll({where:{listId:user.lists[0].id}}).then(function(foundIngredients){
    // res.send(foundIngredients)
    res.render("list",{ingredient:foundIngredients, user:user});

  })

})


app.get("/starlist", function(req,res){
  res.render("star-list");
})


app.get("/my-recipes", function(req,res){
  db.favorite.findAll().then(function(foundFavorites){
    var locals={favoriteRecipes:foundFavorites}
    // res.send(locals);
    res.render("my-recipes", {favoriteRecipes:foundFavorites})
  })
})

app.get("/about", function(req,res){
  res.render("about-contact")
})

//load controllers
app.use("/recipes", recipesCtrl);
app.use("/favorites", favoritesCtrl);

app.listen(process.env.PORT || 3002,function(){
  console.log("Let's do this thing!")
})