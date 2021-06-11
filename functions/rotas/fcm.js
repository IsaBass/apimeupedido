/* eslint-disable consistent-return */

'use strict';


const functions = require('firebase-functions');
const express = require('express');
const router = express.Router();
const indexP = require('../index.js');

const adminFCM = require("firebase-admin");
// adminFCM.initializeApp();
const dbUser = adminFCM.firestore().collection("users");

router.get('/', (req, res, next) => {
    return res.status(200).send({ message: 'Rota FCM detectada com sucesso' });
});


router.post('/pushuser', async (req, res, next) => {

    let simpleKey = req.body.simpleKey;
    if (!(simpleKey > '') || (simpleKey !== 'minhachavesimples'))
        return res.status(400).send({ message: "sem parametro necessario" });
    //
    let idUser = req.body.idUser;
    if (!(idUser > ''))
        return res.status(400).send({ message: "sem parametro necessario" });
    //
    let corpo = req.body.corpo;
    if (!(corpo > ''))
        return res.status(400).send({ message: "sem parametro necessario" });
    //
    let titulo = req.body.titulo;
    if (!(titulo > '')) titulo = 'Mensagem para você';
    // TODO: PEGAR TOKEN DO USER A PARTIR DO idUser

    let doc = await dbUser.doc(idUser).get();
    if ((!doc.exists) || doc === null)
        return res.status(204).send({ message: "usuario nao encontrado" });

    let token = doc.data().tokenCelular;

    if (token === null || !(token > ''))
        return res.status(204).send({ message: "usuario encontrado mas não possui token" });

    // let token = 'aqui um token';
    // let token = "cEWaGFxDMic:APA91bFD5TVs_MI4WkaXDBmpcLFeGJsrvK5pucgo1IJZDjaYMKf7SQk6r3oeyO0VZiBvAxHY9EE_rl9efGyIyKMRkPDavi-lRb8fvdGQFj4CVXian7u_ynRmOUvmoQYT697g4j7xZEFc";
    // let token = "dn768de4FBo:APA91bH7zOpOXwjSOoK5a66sO6wX_dKPoPokPgVP-behE669dEbok2xLdEVjvJdF_bWvAyoUddbu9sxKR_3nUNKwNoNBLpa09K6W8k1QBghlnyGEBuGIjNMRgfcg1fCgDIY-ZjnTc_a4";

    let payloadSend = {
        "token": token,
        "notification": {
            "body": corpo,
            "title": titulo
        },
        // "priority": "high",
        "data": {
            "click_action": "FLUTTER_NOTIFICATION_CLICK"
        }
    }
    let retorno = '';
    ///
    adminFCM.messaging().send(payloadSend).then((v) => {
        retorno = v;
        return res.status(200).send(retorno);
    }).catch((e) => {
        retorno = 'erro na função de envio fcm';
        return res.status(400).send(retorno + ': ' + e);
    });
    ////
   

});



router.post('/pushadmins', async (req, res, next) => {

    let simpleKey = req.body.simpleKey;
    if (!(simpleKey > '') || (simpleKey !== 'minhachavesimples'))
        return res.status(400).send({ message: "sem parametro necessario" });
    //
    let cnpj = req.body.cnpj;
    if (!(cnpj > ''))
        return res.status(400).send({ message: "sem parametro necessario" });
    //
    let corpo = req.body.corpo;
    if (!(corpo > ''))
        return res.status(400).send({ message: "sem parametro necessario" });
    //
    let titulo = req.body.titulo;
    if (!(titulo > '')) titulo = 'Mensagem para você';


    // 
    const dbTokens = adminFCM.firestore().collection("CNPJS");
    let docs = await dbTokens.doc(cnpj).collection("tokensAdms").get();
    if ((docs.empty) || docs === null)
        return res.status(204).send({ message: "empresa nao encontrada" });

    let listaTokens = [];
    docs.forEach((doc) => {
        listaTokens.push(doc.data().tokenCelular);
    });

    if (listaTokens === null || (listaTokens === []))
        return res.status(204).send({ message: "empresa encontrado mas não possui tokens" });

    // let token = 'aqui um token';
    // let token = "cEWaGFxDMic:APA91bFD5TVs_MI4WkaXDBmpcLFeGJsrvK5pucgo1IJZDjaYMKf7SQk6r3oeyO0VZiBvAxHY9EE_rl9efGyIyKMRkPDavi-lRb8fvdGQFj4CVXian7u_ynRmOUvmoQYT697g4j7xZEFc";
    // let token = "dn768de4FBo:APA91bH7zOpOXwjSOoK5a66sO6wX_dKPoPokPgVP-behE669dEbok2xLdEVjvJdF_bWvAyoUddbu9sxKR_3nUNKwNoNBLpa09K6W8k1QBghlnyGEBuGIjNMRgfcg1fCgDIY-ZjnTc_a4";

     corpo = corpo + ' ' +  req.body.appname; 
    
    let payloadSend = {
        "tokens": listaTokens,
        "notification": {
            "body": corpo,
            "title": titulo
        },
        // "priority": "high",
        "data": {
            "click_action": "FLUTTER_NOTIFICATION_CLICK"
        },
        "restrictedPackageName": req.body.appname
    }

    // return res.status(200).send({ "lista": listaTokens,"payload": payloadSend });


    let retorno = '';
    ///
    adminFCM.messaging().sendMulticast(payloadSend).then((v) => {
        retorno = v;
        return res.status(200).send(retorno);
    }).catch((e) => {
        retorno = 'erro na função de envio fcm';
        return res.status(400).send(retorno + ': ' + e);
    });
    //

    // adminFCM.messaging().

});





module.exports = router;