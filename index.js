 const express = require('express') 
 const bodyparser = require('body-parser') 
 const path = require('path') 
 const app = express()
 require('dotenv').config(); 
  
 var Publishable_Key = process.env.STRIPE_PUBLIC_KEY;
 var Secret_Key = process.env.STRIPE_SECRET_KEY;
  
 const stripe = require('stripe')(Secret_Key) 
  
 const port = process.env.PORT || 3000 
  
 app.use(bodyparser.urlencoded({extended:false})) 
 app.use(bodyparser.json()) 
  
 // View Engine Setup 
 app.set('views', path.join(__dirname, 'views')) 
 app.set('view engine', 'ejs') 
  
 app.get('/', function(req, res){ 
     res.render('Home', { 
        key: Publishable_Key 
     }); 
 }); 

 app.get('/key',(req,res)=>{
  return res.send({publicKey: Publishable_Key , status:200});
 });
  
 app.post('/payment', function(req, res){ 
  
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
  
 app.listen(port, function(error){ 
     if(error) throw error 
     console.log("Server created Successfully") 
 }); 