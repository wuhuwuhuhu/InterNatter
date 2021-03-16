const express = require('express');
const router = express.Router();
const User = require('../models/user');
const formidable = require('formidable');
const fs = require('fs');

router.get("/checkRepeat", async (req, res) => {
    let error = "";
    for(let variable in req.query){
        let value = req.query[variable];
        await User.findOne({[variable]: value},function (err,doc){
            if(doc){
                error = `Error: ${value} has been registered as ${variable}, please use another one.`
            }
        });
    }
    if(error){
        res.json({
            code: 0,
            error
        })
    }else{
        res.json({
            code: 1
        })
    }
    
})

module.exports = router;