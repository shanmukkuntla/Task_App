Task Managment App

A simple note taking app built with React, Axios, and a backend API.

Description

This app allows users to create, read, and delete notes. The notes are stored on a backend server and retrieved using Axios.

Features

Create new notes with title and content
View all notes in a list
Delete individual notes
Error handling for API requests
Technical Details

Frontend: React, JavaScript, HTML, CSS
Backend: Node.js, Express.js
API: Axios
Database: MongoDB
Installation

Backend Installation
Install Node.js and MongoDB on your local machine
Create a new directory for the backend project and navigate to it in your terminal/command prompt
Run npm init to create a new package.json file
Install the required dependencies by running npm install express mongoose
Create a new file called server.js and add the following code:
javascript
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/notes', { useNewUrlParser: true, useUnifiedTopology: true });

const noteSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Note = mongoose.model('Note', noteSchema);

app.get('/getData', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

app.post('/createNote', async (req, res) => {
  const note = new Note(req.body);
  await note.save();
  res.json(note);
});

app.delete('/deleteNote/:id', async (req, res) => {
  const id = req.params.id;
  await Note.findByIdAndRemove(id);
  res.json({ message: 'Note deleted successfully' });
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
Start the backend server by running node server.js
Frontend Installation
Install React and create a new React project by running npx create-react-app note-taking-app
Navigate to the project directory and install the required dependencies by running npm install axios
Replace the contents of the App.js file with the code provided above
Start the frontend server by running npm start
Usage

Open your web browser and navigate to http://localhost:3000
Create a new note by filling out the form in the CreateArea component
View all notes in the list below the form
Delete a note by clicking the "Delete" button next to the note
API Endpoints

GET /getData: Retrieves all notes from the backend API
POST /createNote: Creates a new note in the backend API
DELETE /deleteNote/:id: Deletes a note from the backend API
Known Issues

None
Future Development

Implement user authentication and authorization
Add more features, such as editing notes and searching notes
Improve error handling and debugging
Contributing

Contributions are welcome! Please submit a pull request with your changes and a brief description of what you've added.

License

This project is licensed under the MIT License. See LICENSE.txt for details.
