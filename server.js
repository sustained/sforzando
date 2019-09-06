const express = require("express")
const { join } = require("path")

const PORT = process.env.PORT || 5000

const app = express()
app.use(express.static(join(__dirname, "dist")))

app.listen(PORT)
console.log("Server listening on port " + PORT)
