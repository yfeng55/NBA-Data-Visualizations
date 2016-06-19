const express = require('express');
const path = require('path');
const cors = require('cors')
const app = express();


// enable CORS
// app.use(cors())

///// ROUTES /////

app.use('/public', express.static(__dirname + '/public'));


//root path: serve the main page
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html')
});



app.listen(process.env.PORT || 3000, function () {
  console.log('server listening on port 3000');
});