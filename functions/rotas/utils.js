/* eslint-disable consistent-return */
'use strict';

var creditCardType = require('credit-card-type');

const functions = require('firebase-functions');
const express = require('express');
const router = express.Router();
const indexP = require('../index.js');

router.get('/', (req, res, next) => {
    return res.status(200).send({ message: 'Rota Utils detectada com sucesso' });
});


router.post('/cardtype', (req, res, next) => {
    //
    let simpleKey = req.body.simpleKey;
    if (!(simpleKey > '') || (simpleKey !== 'minhachavesimples'))
        return res.status(400).send({ message: "sem parametro necessario" });
    //
    //
    let numcard = req.body.numcard;
    if (!(numcard > ''))
        return res.status(400).send({ message: "sem parametro necessario" });
    //
    var tipoCard = creditCardType(numcard);

    let ambigous = tipoCard.length > 1;


    if(tipoCard.length > 1) {
        return res.status(400).send({ message: "ambiguous" }); 
    }
    if(tipoCard.length < 1) {
        return res.status(400).send({ message: "cartao desconhecido" }); 
    }
  
    
    let retorno = {
        "type": tipoCard[0].type? tipoCard[0].type : '',
        "niceType": tipoCard[0].niceType? tipoCard[0].niceType : '',
        "gaps": tipoCard[0].gaps? tipoCard[0].gaps : [],
        "lengths": tipoCard[0].lengths? tipoCard[0].lengths : [],
        "codeName": tipoCard[0].code.name? tipoCard[0].code.name : '',
        "codeSize": tipoCard[0].code.size? tipoCard[0].code.size : 0,
    }

    return res.status(200).send(retorno);
});




module.exports = router;