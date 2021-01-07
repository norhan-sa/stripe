 require('dotenv').config(); 

 const  express    =   require('express') 
 const bodyparser  =   require('body-parser') 
 const   path      =   require('path') 
 const    app      =   express();
 const stripe_pay  =   require('./routes/stripe');
 const paypal_pay  =   require('./routes/paypal');
 
  
 const Publishable_Key  =  process.env.STRIPE_PUBLIC_KEY;

 const port = process.env.PORT || 3000; 
  
 app.use(bodyparser.urlencoded({extended:false})); 
 app.use(bodyparser.json()); 
  
 // View Engine Setup 
 app.set('views', path.join(__dirname, 'views')); 
 app.set('view engine', 'ejs'); 
  
 app.get('/', function(req, res){ 
    res.render('Home', { 
      key: Publishable_Key 
    }); 
 }); 
 
 app.use('/',stripe_pay);
 app.use('/',paypal_pay);

 app.get('/sucess',(req,res)=>{
   return res.send('success');  
 });
 
 app.get('/failed',(req,res)=>{
   return res.send('Failed');  
 });
  
 app.listen(port, function(error){ 
    if(error) throw error 
    console.log("Server created Successfully") 
 }); 