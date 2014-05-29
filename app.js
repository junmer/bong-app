var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , Promise = require('promise')
  , request = require('request')
  , moment = require('moment')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , BongStrategy = require('passport-bong').Strategy
  , bong = require('./bong/bong')
  , bongWeek = require('./bong/week')
  , pkg = require('./package');

var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride());
app.use(session({secret: pkg.name}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

// configure APP 
var APP_HOST = 'http://127.0.0.1:3000';

// BONG CONF
var BONG_CLIENT_ID = pkg.bong.clientID;
var BONG_CLIENT_SECRET = pkg.bong.clientSecret;
var BONG_HOST = bong.BONG_HOST = 'http://open-test.bong.cn';
var BONG_TOKEN_URL = BONG_HOST + '/oauth/token';
var BONG_AUTHORIZATION_URL = BONG_HOST + '/oauth/authorize';
var BONG_USERPROFILE_URL = BONG_HOST + '/1/userInfo/{$uid}';


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Bong profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the BongStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Bong
//   profile), and invoke a callback with a user object.
passport.use(new BongStrategy({
    authorizationURL: BONG_AUTHORIZATION_URL,
    userProfileURL: BONG_USERPROFILE_URL,
    tokenURL: BONG_TOKEN_URL,
    clientID: BONG_CLIENT_ID,
    clientSecret: BONG_CLIENT_SECRET,
    callbackURL: APP_HOST + '/auth/bong/callback'
  },
  function(accessToken, refreshToken, params, profile, done) {

    // 保存 accesToken
    profile.access_token = accessToken;

    bong.config({
      access_token: accessToken,   
      uid: profile.uid   
    });

    // asynchronous verification, for effect...
    process.nextTick(function () {
      // To keep the example simple, the user's Bong profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Bong account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/auth/bong')
}

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAjaxAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.json({status: 302, statusInfo: '/auth/bong'});
}

// GET /auth/bong
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in bong authentication will involve redirecting
//   the user to bong.com.  After authorization, bongwill redirect the user
//   back to this application at /auth/bong/callback
app.get('/auth/bong',
  passport.authenticate('bong'),
  function(req, res){
    // The request will be redirected to bong for authentication, so this
    // function will not be called.
  });

// GET /auth/bong/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/bong/callback', 
  passport.authenticate('bong', { failureRedirect: '/auth/bong' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});



/////////////////////////////////////////////////////////////////////
/**
 * 首页
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

/**
 * 详情
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

/**
 * 登录
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
// app.get('/login', function(req, res){
//   res.render('login', { user: req.user });
// });


/**
 * 周api
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
app.get('/bongweek/calories', ensureAjaxAuthenticated, function (req, res) {

  var diff = moment().diff(moment().startOf('week'), 'days');
  var tasks = [];
  var time = '';

  for (var i = diff - 1; i >= 0; i--) {
    time = moment().subtract('days', i).format('YYYYMMDD');
    tasks.push(bong.get('/1/bongday/blocks/' + time));
  }

  Promise.all(tasks).then(function (day) {

    // res.json(day);
    res.json({status: 0, data: bongWeek.calories(day)});

  }, function(err){
    res.json({status: -2, statusInfo: err});
  });


});

/**
 * 日详细
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
app.get('/bongday/blocks', ensureAjaxAuthenticated, function(req, res){

  var time = moment().subtract('days', 1).format('YYYYMMDD');

  bong.get('/1/bongday/blocks/' + time).then(function (ret) {
    res.json({status: 0, data: ret});
  }, function(err){
    res.json({status: -2, statusInfo: err});
  });

});



/**
 * 日概要
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
app.get('/bongday/dailysum', ensureAjaxAuthenticated, function(req, res){

  var time = moment().subtract('days', 1).format('YYYYMMDD');

  bong.get('/1/bongday/dailysum/' + time).then(function (ret) {
    res.json({status: 0, data: ret});
  }, function(err){
    res.json({status: -2, statusInfo: err});
  });

});
/////////////////////////////////////////////////////////////////////


app.listen(3000);

console.log('server start at:', APP_HOST);

