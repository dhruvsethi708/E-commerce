const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()
const Stripe = require("stripe")

const app = express()
app.use(cors())
app.use(express.json({limit: "10mb"}))

const PORT = process.env.PORT || 8000

//mongodb connection
mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("database connected")
}).catch((err) => {
    console.log(err)
})

//schema
const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    confirmPassword: String,
    image: String,
})

//model
const userModel = mongoose.model("user", userSchema)


app.get("/", (req,res) => {
    res.send("server is running")
})

//signup
app.post("/signup", async(req, res) => {
    const {email} = req.body

    try{
        const result = await userModel.findOne({ email });
        
        if(result) {
            res.send({ message: "Email id is already registered!", alert: false });
        } else {
            const data = new userModel(req.body);
            const savedUser = await data.save();
        
            res.send({ message: "Successfully signed up", alert: true });
        }
    }catch(err){
        res.status(500).send({ error: "Internal Server Error" });
    }
})

app.post("/login", async(req, res) => {
    const {email} = req.body

    try{
        const result = await userModel.findOne({ email });
        
        if(result) {
            const datasend = {
                _id: result._id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                image: result.image,
            }
            res.send({ message: "Login successfull", alert: true, data: datasend });
        } else {
            res.send({ message: "This email id is not registered, please sign up", alert: false });
        }
    }catch(err){
        res.status(500).send({ error: "Internal Server Error" });
    }

})


// product section

const schemaProduct = mongoose.Schema({
    name: String,
    category: String,
    image: String,
    price: String,
    description: String,
})

const productModel = mongoose.model("product", schemaProduct)


// save product api
app.post("/uploadProduct",async(req,res)=>{
    const data = await productModel(req.body)
    const datasave = await data.save()
    res.send({message : "Upload successfully"})
})


// get products
app.get("/product", async(req, res) => {
    const data = await productModel.find({})
    res.send(JSON.stringify(data))
})


// payment gateway

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

app.post("/create-checkout-session", async(req, res) =>{

    try{
        const params = {
            submit_type : 'pay',
            mode : "payment",
            payment_method_types : ['card'],
            billing_address_collection : "required",
            shipping_options : [{shipping_rate : "shr_1OihliSIoEiHnDqwSsCugdVZ"}],
  
            line_items : req.body.map((item)=>{
              return{
                price_data : {
                  currency : "inr",
                  product_data : {
                    name : item.name,
                    // images : [item.image]
                  },
                  unit_amount : item.price * 100,
                },
                adjustable_quantity : {
                  enabled : true,
                  minimum : 1,
                },
                quantity : item.qty,
                // address: "xyz",
              }

            }),
            // customer_email: "customer@example.com",
            // client_reference_id: "123456",
            success_url : `${process.env.FRONTEND_URL}/success`,
            cancel_url : `${process.env.FRONTEND_URL}/cancel`,
        }
  
        
        const session = await stripe.checkout.sessions.create(params)
        res.status(200).json(session.id)
       }
       catch (err){
          res.status(err.statusCode || 500).json(err.message)
       }
})


app.listen(PORT, () => {
    console.log("server is running at port: " + PORT)
})