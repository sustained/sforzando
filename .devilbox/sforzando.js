const { spawn } = require("child_process")

spawn("npm", ["run", "serve", "--", "--port", "8000"], { stdio: "inherit" })
