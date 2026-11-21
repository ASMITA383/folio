import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookDetails from "./components/BookDetails";
import Homepage from "./components/Homepage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/books/:id" element={<BookDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
