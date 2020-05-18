const express = require('express');
const mongoose= require('mongoose');
var cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
app.use(express.json());
require('dotenv').config()
const config = require('./config/key');

startApp = async()=>{
    try {
        console.log(config);
        await mongoose.connect(
            config.mongoURI,
            {useNewUrlParser: true, useUnifiedTopology: true });
        console.log('connected to db');
        const port = process.env.PORT || 5000
        app.listen(port);
        console.log(`server connected to port ${port}`)
    } catch (error) {
        console.log(error);
    }
}

app.get('/',(req,res)=>{
    res.send("hello world");
})
app.use("/api/user", require('./routers/user'));

startApp();

