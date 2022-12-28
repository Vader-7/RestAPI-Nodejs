require('dotenv').config();
const { connection } = require('./database/connection');
const express = require("express");
const cors = require('cors');


connection();

const app = express();

app.use(cors());
const port = 3900;

//convert body to js 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//routes
const routes_article = require('./routes/article');
app.use('/api', routes_article);





app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
 
