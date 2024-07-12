//server.js
const express = require("express");
const mysql = require("mysql");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const bcrypt = require("bcrypt");
const db_config = require("./config/db_config.json");
const cors = require("cors"); 

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);