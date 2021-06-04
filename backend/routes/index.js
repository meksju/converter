const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const router = express.Router();
const mongoosePaginate = require('mongoose-paginate-v2');
const Currency = mongoose.model('Currency');



router.get('/', function (req, res) {
    Currency.find({}, function (err, resp) {
        if(err){
            console.log(err);
        }else{
            return res.json({data: resp});
        }
    });
});
router.get('/currency', function (req,res) {
    Currency.find(
        {$or: [{name: { $regex: '.*' + req.query.curr + '.*' }},
                {code: { $regex: '.*' + req.query.curr + '.*' } }]},function (err, currency) {
        if(err){
            console.error(err);
        }else{
            return res.json(currency);
        }
    })
});

router.get('/convertation', function (req,res) {
    res.json((req.query.give_rate*req.query.amount)/req.query.get_rate);
});

module.exports = router;
