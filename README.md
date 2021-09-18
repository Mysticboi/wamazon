# Wamazon

**_A full-stack MERN e-commerce website (built from scratch)_**

## Live demo

I deployed this project using heroku. [Live Demo Link](https://wamazon.herokuapp.com/)

Since the website is published on heroku, when you first visit the website it may take some time loading that's because the webiste is "sleeping" and needs some time to wake up. The loading time is not related to the code itself but to heroku's free use policy. More information on [Heroku Documentation](https://devcenter.heroku.com/articles/free-dyno-hours)

## Installation and configuration

### Installation

1. Open a terminal on the working directory: wamazon.
2. Run `npm install` to install backend dependencies.
3. `cd client` and `yarn install` to install frontend dependencies.

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

**My opinion**: Since I am using React in the front-end, I chose to use NodeJS for the backend so I can be using JavaScript/TypeScript for both front and back. Plus there are a lot of practical libraries that you can use to make the development much easier (npm-yarn).

#### - **Express** (Backend framework)

<p align="center">
<img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" width="100">
</p>

Express, is an open-source back end web application framework for Node.js. It is designed for building web applications and APIs. It has been called the de facto standard server framework for Node.js

**My opinion**: I found writing the back-end API really using this framework since it provides a lot of utilities like middlewares, Router class and others.

#### - **MongoDB** (Database)

<p align="center">
<img src="https://upload.wikimedia.org/wikipedia/fr/thumb/4/45/MongoDB-Logo.svg/langfr-220px-MongoDB-Logo.svg.png" width="100">
</p>

MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.

**My opinion**: I've chosen to go with mongoDB as this projec's database since I am only using JavaScript/TypeScript. And it's easy to integrate its JSON-like documents with the structure of the project.

#### - **mongoose** (ODM)

<p align="center">
<img src="https://tsed.io/mongoose.png" width="100">
</p>

Elegant MongoDB object modeling for Node.js. Mongoose provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.

**My opinion**: mongoose has made back-end development much easier and more structured using models and schemas.

#### - Others

- **jsonwebtoken**: used for user's authentification.
- **mutler**: middleware for handling file uploads.
- **GridFS**: for storing and retrieving files like images from mongoDB.
- **nodemailer**: for sending emails like in case of forgotten password.
- **ESLint+Prettier**: ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code. It alows better structuring of the code. Prettier is used for formating.
