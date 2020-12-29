
 const router = require('express').Router();
 const  axios =   require('axios');
 const paypal = require('paypal-rest-sdk');
 require('dotenv').config();

 const   Paypal_ID    =  process.env.PAYPAL_ID; 
 const  Paypal_Secret =  process.env.PAYPAL_SECRET; 
 const   PAYPAL_API   =  'api.sandbox.paypal.com';

 paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': Paypal_ID,
    'client_secret': Paypal_Secret
 });

 router.post('/paypal/create-payment',(req,res)=>{

    var payReq = JSON.stringify({
        'intent':'sale',
        'redirect_urls':{
            'return_url':'https://stripe-nour.herokuapp.com/success',
            'cancel_url':'https://stripe-nour.herokuapp.com/failed'
        },
        'payer':{
            'payment_method':'paypal'
        },
        'transactions':[{
            'amount':{
                'total':'7.47',
                'currency':'USD'
            },
            'description':'This is the payment transaction description.'
        }]
    }); 

        paypal.payment.create(payReq, function(error, payment){
        if(error){
            console.error(error);
            res.status(400).end();
        } else {
            return res.send({id:payment.id});
        }
    });
 });


 router.post('/paypal/execute-payment',(req,res)=>{

    var paymentId = req.body.paymentID;
    var payerId = req.body.payerID;

    console.log(req.body);
    
        paypal.payment.execute(paymentId, payerId, function(error, payment){
        if(error){
            console.error(error);
        } else {
             
            if (payment.state == 'approved'){ 
                res.send('payment completed successfully');
            } else {
                res.send('payment not successful');
            }
        }
    });
 });


 module.exports = router;