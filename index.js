const express = require('express');
const helpers = require('./helper.js');
const route_livre = require('./projet.js');
const route_login = require('./login.js');
const route_profile = require('./profile.js');

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}


const app = express()

app.use(cors(corsOptions)) // Use this after the variable declaration

app.use(express.json());

app.listen(7777, '0.0.0.0', ()=>{
    console.log("Serveur ON sur le Port : 7777")
})

route_livre.projet(app,helpers)
route_login.login(app,helpers)
route_profile.profile(app,helpers)