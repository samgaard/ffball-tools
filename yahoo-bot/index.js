const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const YahooStrategy = require('passport-yahoo-oauth').Strategy;


const leagueId = '851044';
const YAHOO_CONSUMER_KEY = 'dj0yJmk9b1F2VFNuV3pYeThrJmQ9WVdrOU9GazBZWHB3TmpRbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWVh';
const YAHOO_CONSUMER_SECRET = 'f641b9aaf4c9fb1b35ae31d272f5806be28d96fe';

var YahooFantasy = require('yahoo-fantasy');
// you can get an application key/secret by creating a new application on Yahoo!
var yf = new YahooFantasy(
    YAHOO_CONSUMER_KEY,
    YAHOO_CONSUMER_SECRET
);


// Authentication configuration
app.use(session({
    resave:            false,
    saveUninitialized: true,
    secret:            'bla bla bla'
}));

// if a user has logged in (not required for all endpoints)
// yf.setUserToken(
//     Y!CLIENT_TOKEN,
//     Y!CLIENT_SECRET
// );

app.use(passport.initialize());
app.use(passport.session());

passport.use(new YahooStrategy({
        consumerKey:    YAHOO_CONSUMER_KEY,
        consumerSecret: YAHOO_CONSUMER_SECRET,
        callbackURL:    "http://localhost:8000/auth/yahoo/callback"
    },
    function(token, tokenSecret, profile, done) {
        console.log('token')
        console.log(token)
        console.log('tokenSecret')
        console.log(tokenSecret)
        console.log('profile')
        console.log(profile)
        console.log('done')
        console.log(done)

        User.findOrCreate({yahooId: profile.id}, function(err, user) {
            return done(err, user);
        });
    }
));


app.get('/auth/yahoo/callback',
    passport.authenticate('yahoo', {failureRedirect: '/login'}),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

app.get('/',
    passport.authenticate('yahoo'),
    function(req, res, next) {

        // try {
        //     let data = await yf.teams.fetch({team: '223.l.' + leagueId + '.t.' + 1});
        //     console.log(data)
        //     // do your thing
        // } catch (err) {
        //     // handle error
        //     console.log(err)
        // }

        res.send('test');
        next()
    });

app.listen(8000, () => {
    console.log('Example app listening on port 8000!')
});
