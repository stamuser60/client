var path = require('path');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var cookieParser = require("cookie-parser")
var http = require('http')
var https = require('https')

var app = express();
var port = process.env.NODE_PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    req.method === 'OPTIONS' ? res.sendStatus(200) : next();
});

function validateReactAdfsEnvs() {
    if (!process.env.REACT_APP_ADFS_COOKIE_NAME) {
        throw new Error("Please set REACT_APP_ADFS_COOKIE_NAME environment variable")
    }
    if (!process.env.REACT_APP_ADFS_SECRET) {
        throw new Error("Please set REACT_APP_ADFS_SECRET environment variable")
    }
}

if (process.env.USE_ADFS == 'true') {
    /*
    Code inside this if statement is used to initiate the use of ADFS in the client.
    To see what exactly happens behind the scenes check the documentation of the `@mil-757/cpr-adfs` package:
        link to package: 
     */
    validateReactAdfsEnvs()
    var auth = require("@mil-757/cpr-adfs");
    var samlAuth = new auth.SamlAuthorization();
    app.use(samlAuth.passport.initialize());
    app.use("/auth", auth.default.router);
    app.get('/identify', (req, res, next) => {
        samlAuth.init(`https://${req.get("host")}`);

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)
  console.log('////////////////////')

        if (!req.cookies[process.env.ADFS_COOKIE_NAME]) {
            return res.redirect("/auth/saml");
        }
        else if (!req.originalUrl.includes("metadata.xml")) {
            res.cookie(process.env.ADFS_COOKIE_NAME, req.cookies[process.env.ADFS_COOKIE_NAME]);
        }
        next();
    })
    console.log("ADFS on")
} else {
    console.log("ADFS off")
}

var buildDir = path.join(__dirname, '../build');
app.use(express.static(buildDir));
app.get('/*', (req, res) => {
    res.sendFile(`${buildDir}/index.html`);
});

let server;
if (process.env.USE_HTTPS == 'true') {
    server = https.createServer({
        key: process.env.LOCAL_SERVER_HTTPS_KEY || function(){throw Error("Please set LOCAL_SERVER_HTTPS_KEY env variable")}(),
        cert: process.env.LOCAL_SERVER_HTTPS_CERTIFICATE || function(){throw Error("Please set LOCAL_SERVER_HTTPS_CERTIFICATE env variable")}(),
    }, app);
    console.log("HTTPS on")
} else {
    server = http.createServer(app);
    console.log("HTTPS off")
}

server.listen(port, function() {
    console.log(`listening on port ${port}`)
});

module.exports = server
