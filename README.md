# Wamazon

**_A full-stack MERN e-commerce website_**

<p align="center"><b>Currently in development</b></p>

## Installation and configuration

### Installation

1. Open a terminal on the working directory: wamazon.
2. Run `npm install` to install backend dependencies.
3. `cd client` and `yarn install` to install frontend dependencies.
4. In _client/node_moduels/@types_ create react-slideshow-image folder and create a file index.d.ts inside of it with the following content: [index.d.ts](https://react-slideshow.herokuapp.com/typescript) (Section 3.Copy and paste)

### Configuration

In _wamazon/config/index.js_ you can see the necessary configuration of the project.

If you have mongo installed locally on your computer you can use it as your database for the project. Link: `mongodb://localhost:27017/wamazonDatabase`. (If connecting fails on your machine, try using 127.0.0.1 instead of localhost )

If not you can use mongoDB ATLAS to use a free cluster on the cloud. [Official Documentation](https://docs.atlas.mongodb.com/getting-started/)

You'll then need to create a file **wamazon/config.env** and paste your connection string that you can get from your cluster->connection->Connect your application.

Your config.env will look like this:

`ATLAS_URI=mongodb+srv://<username>:<password>@<clustername>.bew5q.mongodb.net/wamazonDatabase?retryWrites=true&w=majority`

## How to start the project locally

Open 2 terminals on the working directory: **wamazon**.

### 1. Start the back-end

`npm start`

### 2. Start the front-end

`cd client` then `yarn start`

## Front-end documentation:

Go to the front [documentation](client/README.md)

## Back-end documentation:

### Technologies used:

#### - **NodeJS** (Main language)

<p align="center">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png" width="100">
</p>

Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.

#### - **Express** (Backend framework)

<p align="center">
<img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" width="100">
</p>

Express, is an open-source back end web application framework for Node.js. It is designed for building web applications and APIs. It has been called the de facto standard server framework for Node.js

#### - **MongoDB** (Database)

<p align="center">
<img src="https://assets.stickpng.com/thumbs/58481021cef1014c0b5e494b.png" width="100">
</p>

MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.

#### - **mongoose** (ODM)

<p align="center">
<img src="https://tsed.io/mongoose.png" width="100">
</p>

Elegant MongoDB object modeling for Node.js. Mongoose provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.

#### - Others

    - jsonwebtoken
    - mutler (middleware for handling file uploads)
    - GridFS (for storing and retrieving files like images from mongoDB)
    - nodemailer (for sending emails like in case of forgotten password)
