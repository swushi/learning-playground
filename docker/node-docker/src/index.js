const express = require("express");

const app = express();

app.get("/", (req, res) => {
   res.send("Hello Docker");
});

app.post("/", (req, res) => {
   res.send("This is home page with post request.");
});

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log(`Server is running on PORT: ${PORT}`);
});