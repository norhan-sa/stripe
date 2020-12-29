 const router = require('express').Router();
 
 const Publishable_Key  =    process.env.STRIPE_PUBLIC_KEY;
 const   Secret_Key     =    process.env.STRIPE_SECRET_KEY;  
 const    stripe        =    require('stripe')(Secret_Key); 

 router.get('/key',(req,res)=>{
  return res.send({publicKey: Publishable_Key , status:200});
 });
  
 router.post('/payment', function(req, res){ 
  
    console.log(req.body);
    stripe.customers.create({ 
        email: req.body.stripeEmail, 
        source: req.body.stripeToken, 
        name: 'Gourav Hammad', 
        address: { 
            line1: 'TC 9/4 Old MES colony', 
            postal_code: '452331', 
            city: 'Indore', 
            state: 'Madhya Pradesh', 
            country: 'India', 
        } 
    }) 
    .then((customer) => { 
        console.log(customer);
        return stripe.charges.create({ 
            amount: 2500,     // Charing Rs 25 
            description: 'Web Development Product', 
            currency: 'usd', 
            customer: customer.id 
        }); 
    }) 
    .then((charge) => { 
        console.log('charge'+charge)
        res.send("Success")  // If no error occurs 
    }) 
    .catch((err) => { 
        res.send(err)       // If some error occurs 
    }); 
 });

 module.exports = router;