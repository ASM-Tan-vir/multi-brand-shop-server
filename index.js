const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t2wjj.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const productsCollection = client.db("productDB").collection("product");
    const brandsCollection = client.db("productDB").collection("brand");

    app.get("/product", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/product", async (req, res) => {
      const name = req.query.name;
      const cursor = productsCollection.find({ brand: name });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    app.get("/brand/:name", async (req, res) => {
      // console.log(req.params.name);
      const cursor = brandsCollection.find();
      const result = await cursor.toArray();
      console.log("Brands:", result);
      res.send(result);
    });

    app.post("/brand", async (req, res) => {
      const newBrand = req.body;
      const result = await brandsCollection.insertOne(newBrand);
      console.log(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome! Server is running.");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
