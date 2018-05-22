const express           =     require('express')
  , path              =     require('path')
  , PORT              =     process.env.PORT || 5000
  , passport          =     require('passport')
  , Strategy          =     require('passport-facebook').Strategy
  , config            =     require('./configuration/config')
  , {Client}            =     require('pg')
  , app               =     express();

  // const connectionStr = "dbname=d1nd0154tedbfl host=ec2-54-247-89-189.eu-west-1.compute.amazonaws.com port=5432 user=lhftxuijckxerm password=64c941f228cb48eee309db6da54f8811071bc4e85deed14ddee927f57dbdc080 sslmode=require"
  // const client = new Client({
  //   connectionString: connectionStr,
  //   ssl: true,
  // });
  // const client = new Client({
  //   host: config.host,
  //   port: config.port,
  //   user: config.username,
  //   password: config.password,
  // })
  const { Client } = require('pg');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
  
  client.connect((err) => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('connected')
    }
  })
  
  client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      console.log(JSON.stringify(row));
    }
    client.end();
  });



app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .use(passport.initialize())
  .use(passport.session())
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


  passport.use(new Strategy({
    clientID: config.facebook_api_key,
    clientSecret:config.facebook_api_secret ,
    callbackURL: config.callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      console.log(`Check whether the User exists or not using profile.id ${profile.clientID}`)
      if(config.use_database==='true')
      {
         //Further code of Database.
      }
      return done(null, profile);
    });
  }
));