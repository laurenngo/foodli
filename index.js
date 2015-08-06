var express = require('express');
var session = require ("express-session");
var bodyParser = require('body-parser');
var recipesCtrl = require('./controllers/recipes');
var favoritesCtrl = require('./controllers/favorites')
var bcrypt = require('bcrypt')
var app = express();
var flash = require('connect-flash');
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


// flash alerts function
app.use(function(req,res,next){
  // var alerts = req.flash();
  res.locals.alerts=req.flash();
  next();
})


//custom middleware - is user logged in
app.use(function(req,res,next){
  // req.session.user = {
  //   id: 9,
  //   lists: [{id: 2}]
  // }
  req.getUser= function(){
    return req.session.user || false;
  }
  next();
})

// checks for user
app.get('*', function(req,res,next){
  res.locals.user=req.getUser();
  next();
});


//POST to add an item to the user's list
app.post("/ingredients/:listId/additem", function(req,res){

  var user=req.getUser();
  //check for stuff ... leave on error
  if(!user){
    console.log("FAIL")
    req.flash('danger','You must be logged in to access My Shopping List.');
    res.redirect("/")
  }

  if(!user.lists) {
    req.flash('danger','You do not have a list! Please contact system administrator.');
    res.redirect('/')
  }

  db.list.find({where:{id:user.lists[0].id}}).then(function(foundList){

    var myList=user.lists.id
    db.ingredient.create({name:req.body.itemName, quantity:req.body.itemQty, unit:req.body.unit, department:req.body.itemDepartment, listId:user.lists.id}).then(function(createdItem){
      console.log(req.body)
      foundList.addIngredient(createdItem)

      res.redirect("/list")
    })
  })
})


// home route
app.get("/", function(req,res){
   res.locals.user=req.getUser();
   console.log(req.getUser())
  res.render("index");
})

// signup route
app.post("/signup", function(req,res){
  var alerts = req.flash();
  var user = req.getUser();
  var userSignup ={email:req.body.email,
                   username:req.body.username,
                   password:req.body.password
                 };

  db.user.findOrCreate({where:{email:req.body.email}, defaults:userSignup})
  .spread(function(user,created){
     if(created){
        req.flash('success','Your account has successfully been created!');
        res.redirect("/")

        user.createList({listName:user.username+"'s List", userId:user.id})
        .then(function(list){
        });
      } else {
        req.flash('danger','The email you entered already exists. Please login or sign up with a different email account.');
      res.redirect("/")
      }
  })
     .catch(function(error){
      req.flash('An error has occured:',error);
      res.redirect(req.headers.referer);
      res.send(error);
     })
})


// login route
app.post("/login", function(req,res){
  var user = req.getUser();
  db.user.find({where:{username:req.body.username},include:[db.list]})
  .then(function(user){
    if(user){
      bcrypt.compare(req.body.password, user.password,function(err,result){
        if(err) {throw err;}
        if(result){
          req.session.user= {
            id:user.id,
            email:user.email,
            username:user.username,
            lists:user.lists
          };
            req.flash('success', 'You have been successfully logged in!');
            res.redirect("/")
        } else {
          req.flash('danger', "Sorry, your username or password did not match. Please try to login again!")
          res.redirect(req.headers.referer)
        }
      })
    } else {
      req.flash('danger',"It looks like you don't have an account yet. Please sign up!")
      res.redirect(req.headers.referer)
    }
  })
})

//GET /auth/logout
//logout logged in user
app.get('/logout',function(req,res){
    var user=req.getUser();
    delete req.session.user;

    req.flash('success', 'You have been successfully logged out!')
    res.redirect('/');

});


//GET /restricted
//an example restricted page
app.get('/restricted',function(req,res){
  if(req.getUser()){
    res.send("Working!")
  } else {
    res.send("Error")
  }
});



// grocery list route
app.get("/list", function(req,res){

  var user=req.getUser();

  if(!user) {
    console.log('not user');
    req.flash('You must be logged in to add to My Shopping List.');
    res.redirect(req.headers.referer)
  }
  //SELECT COUNT(*),department,name,SUM(quantity::INTEGER) as total_qty,unit FROM ingredients WHERE "listId"=2 GROUP BY name,unit,department ORDER BY name ASC;
  else{
  db.ingredient.findAll({
    attributes:[
      'department',
      'name',
      'unit',
      [db.sequelize.fn('count','*'),'cnt'],
      [db.sequelize.fn('sum',db.sequelize.col('quantity')),'totalqty']
    ],
    where:{listId:user.lists[0].id},
    group:['name','unit','department'],
    order:'department ASC, name ASC'
  }).then(function(foundIngredients){
    // res.send(foundIngredients)

    res.render("list",{
      listId:user.lists[0].id,
      ingredient:foundIngredients.map(function(i){ return i.get();}),
      user:user
    });
  })
 }
})

// favorite recipes route
app.get("/my-recipes", function(req,res){
  var user=req.getUser();
  if (!user){
    req.flash('danger', 'Please login to access that page!')
    res.redirect("/")
  } else {
    console.log(req.getUser())
    db.favorite.findAll({where:{userId:user.id}}).then(function(foundFavorites){
    var locals={favoriteRecipes:foundFavorites}
    res.render("my-recipes", {favoriteRecipes:foundFavorites})
  })
  }
})

// about page route
app.get("/about", function(req,res){
  var user=req.getUser();
  res.render("about-contact")
})

//load controllers
app.use("/recipes", recipesCtrl);
app.use("/favorites", favoritesCtrl);

// 404
app.use(function(req, res, next){
   res.status(404).render('404');
});


app.listen(process.env.PORT || 3002,function(){
  console.log("Let's do this thing!")
})