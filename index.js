const express = require('express')
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000
app.use(express.json())
require('dotenv').config();
const cors = require('cors');
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASS}@cluster0.mbvqn67.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)


    const userCollection = client.db('jymTrainer').collection('users')
    const newsLetterCollection = client.db('jymTrainer').collection('news')

// login register user info save database api

    app.post('/users',async(req,res)=>{
        const user = req.body;
     
        // check have a user on social media login
        const query = {email: user.email}
        const existingUser = await userCollection.findOne(query)
        if(existingUser){
          return res.send({message: 'user already exist',insertedId: null})
        }
        const result = await userCollection.insertOne(user);
        res.send(result)
      })


    //   news letter subscribe data save on database 
    app.post('/news',async(req,res)=>{
        const user = req.body;
     
        // check have a user on social media login
        const query = {email: user.email}
        const existingUser = await userCollection.findOne(query)
        if(existingUser){
          return res.send({message: 'user already exist',insertedId: null})
        }
        const result = await newsLetterCollection.insertOne(user);
        res.send(result)
      })

   


    
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);













app.get('/', (req, res) => {
    res.send(' Server is running')
  })
  
  app.listen(port, () => {
    console.log(`server is running on port ${port}`)
  })

  
//   gym
//   sQYmkVf75cQr7d63