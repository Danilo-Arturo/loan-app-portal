import express from "express";
import { readFileSync } from "node:fs";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const users: User[] = JSON.parse(                       // Read and parse the users data from the JSON file
  readFileSync(                                         // Read the users.json file synchronously
    new URL("../data/users.json", import.meta.url),
    "utf8"
  )
);

const app = express();
const PORT = 4001;

app.use(express.json()); // Parse JSON request bodies

//Express maps HTTP methods to routes, allowing us to define endpoints for different actions (GET, POST, PUT, DELETE) on the /users resource.

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    service: "user-service"
  });
});

// Retrieve all users
app.get("/users", (_req, res) => {
  res.status(200).json(users);
});

// Retrieve one user by ID
app.get("/users/:id", (req, res) => {
  const user = users.find(
    (user) => user.id === req.params.id             //Retrieves the value supplied in the URL parameter and compares it to the id of each user in the users array. If a match is found, that user object is returned; otherwise, undefined is returned. 
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  res.status(200).json(user);
});

app.listen(PORT, () => {
  console.log(`User service running at http://localhost:${PORT}`);
});