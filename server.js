const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(express.static("public"));

const usersFile = "users.json";

// Read users from file
function getUsers() {
    if (!fs.existsSync(usersFile)) return [];
    return JSON.parse(fs.readFileSync(usersFile));
}

// Write users to file
function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Signup route
app.post("/signup", (req, res) => {
    const { username, email, password } = req.body;
    const users = getUsers();

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
        return res.json({ success: false, message: "Email already exists." });
    }

    users.push({ username, email, password });
    saveUsers(users);

    res.json({ success: true });
});

// Login route
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();

    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "Invalid credentials." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
