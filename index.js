// Import necessary packages and modules
import dotenv from 'dotenv'; // For handling environment variables
dotenv.config(); // Load environment variables from a .env file

import express from 'express'; // Web framework for creating the server
import bodyParser from 'body-parser'; // Middleware for handling JSON data
import { OpenAI } from "openai"; // OpenAI API client for language models
import colors from 'colors'; // Library for adding colors to console output

// Create an Express application
const app = express();

// Set the port for the server
const port = process.env.PORT || 3000;

// Use bodyParser middleware to parse JSON data in requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Array to store chat history
const chatHistory = [];

app.get("/", (req, res) => {
    res.render("home.ejs");
});
app.get("/question", (req, res) => {
    // Your route handling logic here
    res.render("question.ejs");
});

app.post('/question', async (req, res) => {
    try {
        const userInput = req.body.question;

        const messages = chatHistory.map(([role, content]) => ({
            role,
            content,
        }));

        messages.push({ role: 'user', content: userInput });

        const chat = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
        });

        const completionText = chat.choices[0].message.content;
        console.log(colors.blue('Bot: ') + completionText);

        chatHistory.push(['assistant', completionText]);

        // Send the answer as JSON
        res.json({ answer: completionText });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Display welcome messages
console.log(colors.bold.green('Welcome to the CIPHER CHAT - CHAT BOT!'));
console.log(colors.bold.green('You can start sending prompts'));
