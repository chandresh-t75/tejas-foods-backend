const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3001;
const mongoose = require("mongoose");
 const jwt = require('jsonwebtoken');
require('dotenv').config()

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

// middleware
app.use(cors());
app.use(express.json());

// mongodb configuration using mongoose

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tbglb1w.mongodb.net/tejas-foods?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(
    console.log("MongoDB Connected Successfully!")
  )
  .catch((error) => console.log("Error connecting to MongoDB", error));

  app.post('/jwt', async(req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '24hr'
    })
    console.log("jwt",token);
    res.send({token});
  })


  app.post("/create-payment-intent", async (req, res) => {
    const { price } = req.body;
    const amount=price;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount*100,
      currency: "usd",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      "payment_method_types": [
        "card",
    
      ],
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  });



  const menuRoutes = require('./api/routes/menuRoutes');
  const cartRoutes=require('./api/routes/cartRoutes');
  const userRoutes = require('./api/routes/userRoutes');
  app.use('/menu', menuRoutes)
  app.use('/carts', cartRoutes);
  app.use('/users', userRoutes);



app.get('/', (req, res) => {
  res.send('Hello kdjwjrj!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})