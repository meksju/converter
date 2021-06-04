const axios = require('axios');
const mongoose = require('mongoose');
const schedule = require('node-schedule');
const Currency = mongoose.model('Currency');

 schedule.scheduleJob('0 18 * * *', function(){
     axios.get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
         .then(function (response) {
             response.data.forEach((element)=> {
                 Currency.exists({code: element.cc}, function (err, res) {
                     if (err) {
                         console.log(err);
                     }else{
                         if(res) {
                             Currency.findOne({code: element.cc}, function (err, currency) {
                                 if(err){
                                     console.log(err);
                                 }
                                 else{
                                     if(currency.rate !== element.rate){
                                         currency.rate = element.rate;
                                         currency.save();
                                     }
                                 }
                             });
                         }else {
                             const currency = new Currency({
                                 name: element.txt,
                                 rate: element.rate,
                                 code: element.cc
                             });
                             currency.save();
                         }
                     }
                 })

             })
         })
         .catch(function (error) {
             console.log(error);
         });
});
