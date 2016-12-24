/**
 * Created by mansikhemka on 12/19/16.
 */
//

const express = require('express');
const passport = require('passport');
const Strategy = require('passport-twitter').Strategy; //alternatively, require('passport').TwitterStrategy



passport.use(new Strategy({

        consumerKey: 'LzMnULzXaeSCB8hN8cilociwq',
        consumerSecret :'vO8llZnvvLXWJb2JZ1HowsgSkedsHlMhDxN3inBWFnsZvDvPvp',
        callbackURL: 'http://localhost:3333/login/twitter/return'

    },
    function(token, tokenSecret, profile, cb) {
        //User.findOrCreate(profile, function(err, user) {
        //    if (err) { return done(err); }
        cb(null, profile);
        //   });
    }
));


passport.serializeUser((user, cb)=>{
    cb(null, user.id);
})


passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});
// passport.deserializeUser(function(id, cb) {
//     User.findById(id, function(err, user) {
//         cb(err, user);
//     });
// });

var app = express();


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// Define routes.
app.get('/',
    function(req, res) {
        res.render('home', { user: req.user });
    });

app.get('/login',
    function(req, res){
        res.render('login');
    });

app.get('/login/twitter',
    passport.authenticate('twitter'));


// app.get('/login/twitter/return',
//     passport.authenticate('twitter', { successRedirect: '/login',
//         failureRedirect: '/login' }));

app.get('/login/twitter/return',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
        console.log("hey sexy"+req.body.user);
       // res.render('home',{user: req.body.user})
        res.redirect('/');
    });

app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
       console.log("hey sexy" + req.user)
        res.render('profile', { user: req.user });
    });

app.listen(3333,()=>{
    console.log('http://localhost:3333');
});
