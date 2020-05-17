const express = require('express');
const mongoose= require('mongoose');
var cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
app.use(express.json());
require('dotenv').config()

startApp = async()=>{
    try {
        await mongoose.connect(
            process.env.MONGO_URL,
            {useNewUrlParser: true, useUnifiedTopology: true });
        console.log('connected to db');
        const port = process.env.PORT || 3000
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

