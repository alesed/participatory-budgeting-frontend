/* eslint-disable */

const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname + '/dist/participatory-budgeting'));
app.get('/*', function (req, res) {
  res.sendFile(
    path.join(__dirname + '/dist/participatory-budgeting/index.html')
  );
});
app.listen(process.env.PORT || 8080);
