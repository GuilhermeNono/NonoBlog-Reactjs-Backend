const express = require('express')
const path = require('path')
const cors = require('cors')
const router = require('./routes/Router.js')
require('dotenv').config()

const port = process.env.PORT;

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors({credentials:true, origin:'*'}))

app.use("/uploads", express.static(path.join(__dirname, "/uploads")))

require("./config/db.js")

app.use(router)


app.listen(port, () => {
    console.log(`Rodando na porta ${port}`)
});