Create a Firebase project. Firebase will generate a unique address for your app, and will be ready to host it on it's servers.
Be sure that you allow the access to google [](https://accounts.google.com/DisplayUnlockCaptcha) and Less secure apps enabled
Clone the repo, install firebase-tools, login into Google account:
```
git clone https://github.com/xlakostax/feedback-form-react.git
cd feedback-form-react
npm install -g firebase-tools
firebase login
firebase init
```
Firebase initialization

1. Select the Firebase features to use: Database, Hosting, Functions. Press enter to go to the next step.
2. Choose the corresponding project using the up and down keys
3. Keep the default for the Database Rules file name and just press enter
4. To the question about public directory type _build_
5. To the question about the app to be configured as a single-page app type _y_
6. Type _n_ to keep your own "index.html," generated by our build process earlier

Install all other dependencies:
```
npm install
cd functions
npm install
```
To use Firebase Database in our app, you need to import the firebase javascript library and configure it with Firebase application keys, which can be found in the Firebase Console. Open project in the Overview section, click "Add Firebase to your web app". The key should be like that:
```
var config = {
  apiKey: "xxxxxxxxxxxxxx",
  authDomain: "your-domain-name.firebaseapp.com",
  databaseURL: "https://your-domain-name.firebaseio.com",
  storageBucket: "your-domain-name.appspot.com",
  messagingSenderId: "123123123123"
};
firebase.initializeApp(config);
```
Create the file Firebase.js in src folder of the project and put there this piece of code:
```
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
var config = {
  ...
};
const firebaseConf = firebase.initializeApp(config);
export default firebaseConf;
```
Check firebase.json in app root folder for public and rewrites:
```
"public": "build",
...
"rewrites": [
      {
        "source": "/app",
        "function": "app"
      }
```
Check database.rules.json in app root folder. For the sake of simplicity there are the anonymous entrance is turned on, and the rule which allows read / write for all.
```
{
  "rules": {
    ".read": true,
    ".write": true
  }
}

```
In Firebase Console -> Functions copy the function path, and replace .post path in Form.js with it:
```
.post( 'https://us-central1-react-feedback-form.cloudfunctions.net/app', formObj, axiosConfig )
```
To set autentifications constants _const gmailEmail = functions.config().gmail.login;_ and _const gmailPassword = functions.config().gmail.pass;_ set your credentials:
```
firebase functions:config:set gmail.email=user@gmail.com gmail.password=password
```
The last step is to make a build and deploy it into firebase
```
npm run build && firebase deploy
```
Open the Firebase Console -> Hosting, and follow the link

[Feadback form with message history example](https://react-feedback-form.web.app/)

Also you can start it locally:
1. Open the Service Accounts pane of the Google Cloud Console.
2. Make sure that App Engine default service account is selected, and use the options menu at right to select Create key.
3. When prompted, select JSON for the key type, and click Create.
4. Set your Google default credentials to point to the downloaded key:
```
set GOOGLE_APPLICATION_CREDENTIALS=path\to\key.json
firebase emulators:start
```
