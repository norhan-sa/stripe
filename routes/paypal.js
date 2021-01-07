
 const router = require('express').Router();

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

 router.post('/paypal/pay',(req,res)=>{

    console.log(req.get('User-Agent'));
  
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "https://stripe-nour.herokuapp.com/success",
            "cancel_url": "https://stripe-nour.herokuapp.com/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "25.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "25.00"
            },
            "description": "This is the payment description."
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log(`PayPal Create Payment Error : `+ error.message);
        } else {
            for(let i  = 0; i < payment.links.length; ++i){
                if(payment.links[i].rel === 'approval_url'){
                    res.send({redirect_url: payment.links[i].href});
                }
            }
        }
    });

 });


 router.get('/success',(req,res)=>{

  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  var execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": "25.00"
        }
    }]
   };

   paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        res.send('error')
    } else {
        console.log("Get Payment Response");
        console.log(JSON.stringify(payment));
        res.send('success');
    }
   }); 
 });



 router.get('/cancel', (req,res)=>{
   res.send('canceled');
 });

 module.exports = router;