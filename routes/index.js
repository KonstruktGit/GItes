const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
  res.send('Witaj w aplikacji!');
});
module.exports = router;
