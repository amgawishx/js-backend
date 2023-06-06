handlers = require("../rest/handlers.js");
express = require('express');

var app = express();
app.use(express.json());
app.use('/dbapi/fetch', handlers.fetch);
app.use('/dbapi/user', handlers.user);
app.listen(5000);