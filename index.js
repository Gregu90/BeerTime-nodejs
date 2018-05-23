const express           =     require('express')
  , path              =     require('path')
  , PORT              =     process.env.PORT || 5000
  , passport          =     require('passport')
  , Strategy          =     require('passport-facebook').Strategy
  , auth              =     require('./configuration/auth')
  , flash             =     require('connect-flash')
  , morgan            =     require('morgan')
  , cookieParser      =     require('cookie-parser')
  , bodyParser        =     require('body-parser')
  , session           =     require('express-session')
  , {Client}          =     require('pg')
  , app               =     express();

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
  
  client.connect()
  .then(() => console.log('connected'))
  .catch(e => console.error('connection error', err.stack))
 require('./configuration/passport')(passport); // pass passport for configuration

app
  .use(express.static(path.join(__dirname, 'public')))
  .use(morgan('dev'))
  .use(cookieParser())
  .use(bodyParser())
  .set('view engine', 'ejs')
  .use(session({secret:'ilovespalkabeertimetimebeerlovepalka'}))
  .use(passport.initialize())
  .use(passport.session())
  .use(flash())
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  require('./app/routes.js')(app, passport);

//   passport.use(new Strategy({
//     clientID: auth.facebookAuth,
//     clientSecret:auth.secret ,
//     callbackURL: auth.callback_url
//   },
//   function(accessToken, refreshToken, profile, done) {
//     process.nextTick(function () {
//       //Check whether the User exists or not using profile.id
//       console.log(`Check whether the User exists or not using profile.id ${profile.clientID}`)
//       if(config.use_database==='true')
//       {
//          //Further code of Database.
//       }
//       return done(null, profile);
//     });
//   }
// ));