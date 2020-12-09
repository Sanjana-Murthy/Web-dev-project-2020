//SETTING UP LIBRARIES
var express  = require("express");
var mongoose = require("mongoose"); 
var passport = require("passport"); 
var bodyParser    = require("body-parser");
var LocalStrategy = require("passport-local"); 
var passportLocalMongoose = require("passport-local-mongoose"); 
    User = require("./models/user"); 
  
mongoose.set('useNewUrlParser', true); 
mongoose.set('useFindAndModify', false); 
mongoose.set('useCreateIndex', true); 
mongoose.set('useUnifiedTopology', true); 
//CONNECTING TO DATABASE
mongoose.connect("mongodb://localhost:27017/usersDB"); 
  
var app = express(); 
app.set("view engine", "ejs"); 
app.use(bodyParser.urlencoded({ extended: true })); 
  
app.use(require("express-session")({ 
    secret: "ENCRYPTING",            //encode or decode session
    resave: false, 
    saveUninitialized: false
})); 
  
app.use(passport.initialize()); 
app.use(passport.session()); 
  
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); //session encoding
passport.deserializeUser(User.deserializeUser()); //session decoding
  
//===================== 
// ROUTES 
//===================== 
  
// Showing home page 
app.get("/", function (req, res) { 
    res.render("project"); 
});  
  
// Handling user signup 
app.post("/project", function (req, res) { 
    User.register(new User(
	{
		firstname:req.body.firstname,
		lastname:req.body.lastname,
		password:req.body.password,
		mobilenum:req.body.mobilenum,
		emailID:req.body.emailID
	}),function(err,user)
	{
		if(err)
		{
			console.log(err);
			res.render("project");
		}
}); 
passport.authenticate("local")(req,res,function()
	{
		res.redirect("/poject");
	})
	})
	
//Handling user login 
app.post("/login", passport.authenticate("local", { 
    successRedirect: "/rooms", 
    failureRedirect: "/project"
}), function (req, res) { 
}); 
  
//Handling user logout  
app.get("/logout", function (req, res) { 
    req.logout(); 
    res.redirect("/logout"); 
}); 
  
function isLoggedIn(req, res, next) { 
    if (req.isAuthenticated()) return next(); 
    res.redirect("/login"); 
} 
  
var port = process.env.PORT || 3000; 
app.listen(port, function () { 
    console.log("Server Has Started!"); 
}); 
