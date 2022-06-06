require('dotenv').config();

const express = require('express');
const sequelize = require('./db');
const models = require("./models/models");
const PORT = process.env.PORT || 3002;
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorHandlingMiddleware = require("./middleware/ErrorHandlingMiddleware");
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);

//обработка ошибок всегда самым последним тк последний middleware
app.use(errorHandlingMiddleware);

const start = async ()=>{
    try{
        await sequelize.authenticate();
        await sequelize.sync()
        app.listen(PORT, ()=>console.log(`running at port ${PORT}`))
    }
    catch (e){
        console.log(e)
    }
};

start();
