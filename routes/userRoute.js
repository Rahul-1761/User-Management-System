const express = require("express");
const user_route = express();
const session = require("express-session");

const config = require('../config/config');

user_route.use(session({secret:config.SESSIONSECRET}));

const auth = require("../middleware/auth");

user_route.set('view engine', 'ejs');
user_route.set('views', './views/users');

const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

const multer = require("multer");
const path = require("path");

const fileStorage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname, '../public/userImages'));
    },
    filename: function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null, name);
    }
});

/*The code you provided sets up the configuration for handling file uploads using the `multer` middleware in a Node.js application. Let's break down the code:

1. **`const multer = require("multer");`**:
   - Imports the `multer` library, which is a middleware for handling `multipart/form-data`, primarily used for file uploads.

2. **`const path = require("path");`**:
   - Imports the built-in `path` module, which provides utilities for working with file and directory paths.

3. **`const storage = multer.diskStorage({ ... });`**:
   - Configures the storage engine to be used by `multer`. In this case, it uses the `diskStorage` option, which means it will store uploaded files on the disk.

   - **`destination: function(req, file, cb) { ... }`**:
     - Specifies the destination directory for storing the uploaded files. In this example, it sets the destination to the 'public/userImages' directory using `path.join(__dirname, '/public/userImages')`. This is the location where the uploaded files will be saved.

   - **`filename: function(req, file, cb) { ... }`**:
     - Specifies how to name the uploaded files. In this example, it generates a unique filename using the current timestamp (`Date.now()`) and concatenates it with the original filename (`file.originalname`). This ensures that each uploaded file has a unique name.

So, when a file is uploaded, `multer` will use this configuration to save the file to the specified destination directory with a unique filename. This is a common setup for handling file uploads in a Node.js application. */



const upload = multer({storage:fileStorage});

const userController = require('../controllers/userController');

user_route.get('/register', auth.isLogout, userController.loadRegister);

user_route.post('/register', upload.single('image'), userController.insertUser); /* .single('image'): This method specifies that the route expects a single file upload with the field name 'image'. The string 'image' here corresponds to the name attribute of the HTML form input that will be used to upload the file. For example, if you have an HTML form like this:*/

user_route.get('/verify', userController.verifyMail);

user_route.get('/', auth.isLogout, userController.loginLoad);
user_route.get('/login', auth.isLogout, userController.loginLoad);

user_route.post('/login', userController.verifyLogin);

user_route.get('/home', auth.isLogin, userController.loadHome);

user_route.get('/logout', auth.isLogin, userController.userLogout);

module.exports = user_route;