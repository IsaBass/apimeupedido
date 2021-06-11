

const functions = require('firebase-functions');


const express = require('express');
const app = express();




// usa body parser para converter tuudo body em json
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// fim body parser


const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore().collection("CNPJS");
// const ffcm = admin.messaging(admin.app);





app.get("/", (request, response) => {
    
    return response.status(200).send({ 
        message: "API MeuPedido",
        "versao": "0.0.2f",
        "Responsavel":"AGSystem Aracaju",
         "telefone":"-----",
         //"dataHora": FieldValue.serverTimestamp()  // serve apenas para tabela
         "dataHora": Date.now()
        });
});


//carrega rotas
const rotas = express.Router();
//
// const rotaAuthentica = require('./rotas/ags_authentic');
// app.use('/geretoken',rotaAuthentica.geretoken);
//
// const rotaLoja = require('./rotas/loja-rota.js');
// app.use('/loja' , rotaAuthentica.authorize,rotaLoja);
const rotaUtils = require('./rotas/utils');
app.use('/utils',rotaUtils);
const rotaFCM = require('./rotas/fcm');
app.use('/fcm',rotaFCM);
//fim rotas







exports.api = functions.https.onRequest(app);  /// importante PARA FIREBASE
exports.db = db; // para as rotas poderem usar
// exports.ffcm = ffcm; // para as rotas poderem usar
// exports.admin = admin; // para as rotas poderem usar

