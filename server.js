const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON data from HTTP requests
app.use(express.json());

// --- IN-MEMORY DATABASE ---
// We use a simple array to store our users. 
// Note: This resets every time the server restarts.
let users = [];
let currentId = 1; // Simple auto-incrementing ID counter

// --- ENDPOINTS ---

// Root route to show the API is working
app.get('/', (req, res) => {
    res.send('User Management API is running! Go to /users to see the data.');
});

// 1. POST /users - Create a new user
app.post('/users', (req, res) => {
    // Extract data from the request body
    const { name, email, role } = req.body;

    // Basic validation
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    // Create the new user object
    const newUser = {
        id: currentId++,
        name,
        email,
        role: role || 'user' // Default to 'user' if no role is provided
    };

    // Save to our "database"
    users.push(newUser);

    // Return 201 Created and the new user data
    res.status(201).json(newUser);
});

// 2. GET /users - List users with optional filters (search & sort)
app.get('/users', (req, res) => {
    const { search, sort, order } = req.query;
    
    // Create a copy of the users array to manipulate
    let result = [...users];

    // Filter logic: If ?search= is provided, check if the name or email includes the search term
    if (search) {
        const lowerCaseSearch = search.toLowerCase();
        result = result.filter(user => 
            user.name.toLowerCase().includes(lowerCaseSearch) || 
            user.email.toLowerCase().includes(lowerCaseSearch)
        );
    }

    // Sort logic: If ?sort= is provided (e.g., ?sort=name&order=asc)
    if (sort) {
        result.sort((a, b) => {
            // Check if properties exist to avoid errors
            if (a[sort] < b[sort]) return order === 'desc' ? 1 : -1;
            if (a[sort] > b[sort]) return order === 'desc' ? -1 : 1;
            return 0;
        });
    }

    res.json(result);
});

// 3. GET /users/:id - Get specific user details
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id); // Convert string ID from URL to a number
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
});

// 4. PUT /users/:id - Update an existing user
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Update the user details, keeping existing ones if not provided in the request body
    const updatedUser = {
        ...users[userIndex],
        ...req.body,
        id: userId // Ensure the ID cannot be changed
    };

    users[userIndex] = updatedUser;
    res.json(updatedUser);
});

// 5. DELETE /users/:id - Delete a user
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Remove 1 element at the found index
    users.splice(userIndex, 1);
    
    // 204 No Content is standard for a successful delete where no data needs to be returned
    res.status(204).send(); 
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});