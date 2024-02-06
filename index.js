const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const dontenv = require("dotenv");
const path = require("path");

const app = express();
dontenv.config();

const port = process.env.PORT || 3000;
// importing username and password form env file
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

// Connecting to MongoDB Server Database 
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.noafmwz.mongodb.net/registrationFormDB`,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
});

// Registration Schema
const registrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});
// Model of registration Schema
const Registration = mongoose.model("Registration", registrationSchema);

// to make data readable coming from database
app.use(bodyParser.urlencoded ({ extended: true }));
// to convert data into json
app.use(bodyParser.json())

// getting response of home page in root
app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/public/index.html");
});

// saving data with post method
app.post("/register", async (req, res) => {
    try{
        const{name, email, password} = req.body;
        // making new object using model
        const existingUser = await Registration.findOne({email : email});
        if(!existingUser){
            const registrationData = new Registration({
                name,
                email,
                password
            });
            await registrationData.save();
            res.redirect("/success");
        }
        else {
            console.log('User Already Exist');
            res.redirect("/error");
        }
    }
    catch (error){
        console.log(error);
        res.redirect("/error");
    }
})

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/public/success.html")
})

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/public/failed.html")
})

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})

app.use(express.static('public'));

