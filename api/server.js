const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexStore = require("connect-session-knex")(session);

const apiRouter = require("./api-router.js");
const knex = require("../database/dbConfig.js");

const server = express();

const sessionConfig = {
  name: "monster",
  secret: "keep it secret, keep it safe!",
  resave: false,
  saveUninitialized: true, // related to GDPR compliance
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false, // should be true in production
    httpOnly: true // true means JS can't touch the cookie
  },
  // remember the new keyword
  store: new KnexStore({
    knex,
    tablename: "sessions",
    createtable: true,
    sidfieldname: "sid",
    clearInterval: 1000 * 60 * 15
  })
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api", apiRouter);

module.exports = server;
