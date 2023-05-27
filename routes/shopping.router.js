const express = require('express');
const path = require('path');
// const controller = require('../controllers/shopping.controller');
const router = express.Router();


router.post('/paginaCompras', (req, res) => {
    const filePath = path.join(__dirname, 'localhost:3000/api/v1/paginaCompras');
    res.sendFile(filePath);
});
// router.get('/:user_name', controller.addItem);

module.exports = router;
