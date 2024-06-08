const express = require('express')
const app = express();
const { MongoClient, ServerApiVersion, Timestamp } = require('mongodb');
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

    const addNewClassCollection = client.db('jymTrainer').collection('class')
    const blogCollection = client.db('jymTrainer').collection('blogs')
    const appliedCollection = client.db('jymTrainer').collection('appliedTrainer')
    const userCollection = client.db('jymTrainer').collection('users')
    const newsLetterCollection = client.db('jymTrainer').collection('news')



    // add new class api save data in mongodb
    app.post('/jymClass', async (req, res) => {
      const jymData = req.body;
      const result = await addNewClassCollection.insertOne(jymData)
      console.log(result);
      res.send(result)

    })

    // get all add new class api
    app.get('/jymAllClass', async (req, res) => {
      const cursor = addNewClassCollection.find();
      const result = await cursor.toArray();
      console.log(result);
      res.send(result)

    })



    // add blog api
    app.post('/blog', async (req, res) => {
      const newBlog = req.body;
      console.log(newBlog);

      const blogResult = await blogCollection.insertOne(newBlog);


      const cursor = blogCollection.find().sort({ date: -1 }).limit(6);
      const recentBlogs = await cursor.toArray();


      res.send({ blogResult, recentBlogs });
    });


    





    // get recent blog posts
    app.get('/blog', async (req, res) => {
      const cursor = blogCollection.find().sort({ date: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });


    // get a specific blog id api
    app.get('/blog/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await blogCollection.findOne(query)
      res.send(result)
    })




    // get a all user data 
    app.get('/users',async(req,res)=>{
      const result = await userCollection.find().toArray();
      res.send(result)
    })




    // login register user info save database api
    // 
    // app.post('/users',async(req,res)=>{
    //     const user = req.body;

    //     // check have a user on social media login
    //     const query = {email: user.email}
    //     const existingUser = await userCollection.findOne(query)
    //     if(existingUser){
    //       return res.send({message: 'user already exist',insertedId: null})
    //     }
    //     const result = await userCollection.insertOne(user);
    //     res.send(result)
    //   })



    // save a user data in db 
    app.put('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user?.email }
      
      // check  if user already exist in db
      const isExist = await userCollection.findOne(query)

      if (isExist) {
        if (user.status === 'Requested') {
          const result = await userCollection.updateOne(query, {
            $set:
              { status: user?.status },

          })
          return res.send(result)

        }
        else {
          return res.send(isExist)
        }
      }

      const options = { upsert: true }

      const updateDoc = {
        $set: {
          ...user,
          Timestamp: Date.now()
        }
      }
      const result = await userCollection.updateOne(query, updateDoc, options);
      res.send(result)
    })


    // set a user role base user email 
    app.get('/users/:email',async(req,res)=>{
      const email = req.params.email;
      const result = await userCollection.findOne({email});
      res.send(result)
    })



    // update user role api
    app.patch('/users/update/:email',async(req,res)=>{
      const email = req.params.email;
      const user = req.body;
      const query = {email};
      const updateDoc = {
        $set:{
          ...user,  Timestamp: Date.now(),
        }
      }
      const result = await userCollection.updateOne(query,updateDoc)
      res.send(result)

    })







    //   news letter subscribe data save on database 
    app.post('/news', async (req, res) => {
      const user = req.body;

      // check have a user on social media login
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query)
      if (existingUser) {
        return res.send({ message: 'user already exist', insertedId: null })
      }
      const result = await newsLetterCollection.insertOne(user);
      res.send(result)
    })





    app.post('/applied', async (req, res) => {
      const appliData = req.body;
      console.log(appliData)

      const result = await appliedCollection.insertOne(appliData);
      res.send(result)
    });



      // get recent blog posts
      app.get('/applied', async (req, res) => {
        const cursor = appliedCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });


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