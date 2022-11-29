const express = require('express');
const router = express();

router.get("/", (req, res) => {
    res.send("API Working!")
})

module.exports = router;