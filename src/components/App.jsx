import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import Axios from "axios";
import { clear } from "@testing-library/user-event/dist/clear";

function App() {
  const [notes, setNotes] = useState([]);
  const [data, setData] = useState();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await Axios.get("http://localhost:5000/getData");
        setData(response.data);
      } catch (error) {
        console.error(error);
        console.error(error.response); // This will give you more information about the error
      }
    };
    getData();
  }, []);

  function addNote(newNote) {
    setNotes((prevNotes) => {
      return [...prevNotes, newNote];
    });
  }

  function deleteNote(id) {
    setNotes((prevNotes) => {
      return prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={index}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;