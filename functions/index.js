const admin = require( 'firebase-admin' );
const bodyParser = require( 'body-parser' );
const cors = require( 'cors' );
const express = require ( 'express' );
const functions = require( 'firebase-functions' );
const nodemailer = require( 'nodemailer' );

const app = express();

// Account parameters. firebase functions:config:set gmail.login=yourlogin@gmail.com gmail.pass=yourpass
const gmailEmail = functions.config().gmail.login;
const gmailPassword = functions.config().gmail.pass;

admin.initializeApp();

// middleware for CORS enabling
app.use(
  cors({
      // origin: '*'
      origin: true
  })
);

// middleware for parsing bodies from URL
app.use(
  bodyParser.urlencoded({
      extended: true
  })
);

// middleware for parsing JSON
app.use( bodyParser.json() );

//creating function for sending emails
app.post( '/', ( req, res ) => {
    const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>
        <li>Email: ${req.body.email}</li>
        <li>Name: ${req.body.name}</li>
        <li>Message: ${req.body.message}</li>
      </ul>
    `;

// Create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: gmailEmail,
            pass: gmailPassword
        }
    });

// setup email data with unicode symbols
    const mailOptions_request = {
        from: req.body.email,
        to: gmailEmail,
        subject: 'A new request frow web page!',
        html: output
    };

    const mailOptions_response = {
        to: req.body.email,
        subject: 'Thank you for contacting us!',
        html: 'We will acknowledge your request shortly.'
    };

// Send mail with defined transport object
    transporter.sendMail( mailOptions_request, ( err, info ) => {
        if ( err ) {
            console.log( err );
        } else {
            console.log( info );
        }
    });

    transporter.sendMail( mailOptions_response, ( err, info ) => {
        if ( err ) {
            return res.status(500).json({
                msg: 'fail'
            })
            console.log( err );
        } else {
            return res.status(200).json({
                msg: 'success'
            })
            console.log( info );
        }
    })
});

exports.app = functions.https.onRequest( app );
