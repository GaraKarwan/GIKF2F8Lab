const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const routes = require("./routes");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static('public'));
app.use('/api/', routes);
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});