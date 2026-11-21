import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createBookId, getBooks, saveBooks } from "../books";
import AddBook from "./AddBook";
import "./Homepage.css";

function Stars({ value = 0 }) {
  return <span className="stars" aria-label={`${value} out of 5 stars`}>{"★".repeat(Math.round(value))}{"☆".repeat(5 - Math.round(value))}<span className="rating-number">{Number(value).toFixed(1)}</span></span>;
}

function Homepage() {
  const [books, setBooks] = useState(getBooks);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All genres");
  const [sort, setSort] = useState("Recently added");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();

  const genres = useMemo(() => ["All genres", ...new Set(books.map((b) => b.genre).filter(Boolean).sort())], [books]);
  const visibleBooks = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    const result = books.filter((book) => {
      const matchesText = !needle || [book.title, book.author, book.publisher, book.genre].some((part) => String(part || "").toLocaleLowerCase().includes(needle));
      return matchesText && (genre === "All genres" || book.genre === genre) && (!favoritesOnly || book.favorite);
    });
    return result.sort((a, b) => {
      if (sort === "Title A–Z") return a.title.localeCompare(b.title);
      if (sort === "Top rated") return Number(b.rating) - Number(a.rating);
      if (sort === "Oldest first") return String(a.publishedDate || "9999").localeCompare(String(b.publishedDate || "9999"));
      return 0;
    });
  }, [books, query, genre, sort, favoritesOnly]);

  function commit(next, message) {
    if (!saveBooks(next)) {
      setNotice("Your browser storage is full. Try using a smaller cover image.");
      return false;
    }
    setBooks(next);
    setNotice(message || "Saved to your library");
    window.setTimeout(() => setNotice(""), 2800);
    return true;
  }

  function handleSave(values) {
    const now = new Date().toISOString();
    const next = editingBook
      ? books.map((book) => book.id === editingBook.id ? { ...book, ...values, updatedAt: now } : book)
      : [{ ...values, id: createBookId(), favorite: false, createdAt: now }, ...books];
    if (commit(next, editingBook ? "Book details updated" : "Book added to your library")) {
      setShowForm(false);
      setEditingBook(null);
    }
  }

  function toggleFavorite(book) {
    commit(books.map((item) => item.id === book.id ? { ...item, favorite: !item.favorite } : item), book.favorite ? "Removed from your shelf" : "Added to your favorites");
  }

  function deleteBook(book) {
    if (window.confirm(`Remove “${book.title}” from your library? This cannot be undone.`)) commit(books.filter((item) => item.id !== book.id), "Book removed from your library");
  }

  const average = books.length ? (books.reduce((sum, book) => sum + (Number(book.rating) || 0), 0) / books.length).toFixed(1) : "—";

  return <main className="library-page">
    <header className="topbar"><Link className="brand" to="/"><span className="brand-mark">f</span> folio<span className="brand-dot">.</span></Link><span className="topbar-note">YOUR PERSONAL READING ROOM</span><button className="primary-button top-add" onClick={() => { setEditingBook(null); setShowForm(true); }}>＋ <span>Add a book</span></button></header>
    <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> YOUR BOOKS, BEAUTIFULLY KEPT</div><h1>A little shelf<br />of <em>everywhere.</em></h1><p>A home for the stories you love, the ones you’re reading, and the ones still waiting.</p><button className="hero-link" onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}>Explore your collection <span>↓</span></button></div><div className="hero-art" aria-hidden="true"><div className="hero-sun" /><div className="hero-book hero-book-one" /><div className="hero-book hero-book-two" /><div className="hero-book hero-book-three" /><div className="hero-book hero-book-four" /><div className="hero-vase">✿</div><div className="hero-caption">stories live here <span>✳</span></div></div></section>
    <section className="stats-row" aria-label="Library overview"><div className="stat"><strong>{books.length.toString().padStart(2, "0")}</strong><span>BOOKS ON YOUR SHELF</span></div><div className="stat-divider"/><div className="stat"><strong>{average}<small> ★</small></strong><span>YOUR AVERAGE RATING</span></div><div className="stat-divider"/><div className="stat"><strong>{books.filter((b) => b.favorite).length.toString().padStart(2, "0")}</strong><span>FAVORITES</span></div><div className="stats-note">A good book is a place<br />you can return to.</div></section>
    <section id="collection" className="collection"><div className="collection-heading"><div><div className="eyebrow">THE COLLECTION</div><h2>Your bookshelf<span>.</span></h2></div><button className={`favorites-toggle ${favoritesOnly ? "active" : ""}`} onClick={() => setFavoritesOnly(!favoritesOnly)}>{favoritesOnly ? "♥ Showing favorites" : "♡ Favorites"}</button></div>
      <div className="toolbar"><label className="search-box"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search titles, authors, genres…" aria-label="Search your books" />{query && <button aria-label="Clear search" onClick={() => setQuery("")}>×</button>}</label><div className="toolbar-selects"><select aria-label="Filter by genre" value={genre} onChange={(e) => setGenre(e.target.value)}>{genres.map((item) => <option key={item}>{item}</option>)}</select><select aria-label="Sort books" value={sort} onChange={(e) => setSort(e.target.value)}><option>Recently added</option><option>Title A–Z</option><option>Top rated</option><option>Oldest first</option></select></div></div>
      {visibleBooks.length ? <div className="book-grid">{visibleBooks.map((book) => <article className="book-card" key={book.id}><button className="cover-button" onClick={() => navigate(`/books/${book.id}`)} aria-label={`View ${book.title}`}><div className="book-cover" style={book.cover ? { backgroundImage: `linear-gradient(180deg, transparent 55%, rgba(20,19,18,.18)), url("${book.cover.replaceAll('"', '%22')}")` } : undefined}>{!book.cover && <span className="cover-placeholder">{book.title.split(/\s+/).slice(0, 3).map((w) => w[0]).join("")}</span>}<span className="cover-open">↗</span></div></button><div className="card-info"><div className="card-category">{book.genre || "UNCATEGORIZED"}</div><button className="card-title" onClick={() => navigate(`/books/${book.id}`)}>{book.title}</button><div className="card-author">by {book.author || "Unknown author"}</div><div className="card-bottom"><Stars value={Number(book.rating) || 0} /><div className="card-actions"><button title={book.favorite ? "Remove favorite" : "Add favorite"} aria-label={book.favorite ? "Remove favorite" : "Add favorite"} onClick={() => toggleFavorite(book)}>{book.favorite ? "♥" : "♡"}</button><button title="Edit book" aria-label={`Edit ${book.title}`} onClick={() => { setEditingBook(book); setShowForm(true); }}>···</button></div></div></div></article>)}</div> : <div className="empty-state"><div className="empty-icon">⌕</div><h3>{books.length ? "No books found" : "Your shelf is ready"}</h3><p>{books.length ? "Try another search or clear your filters." : "Add a book to start building your personal reading room."}</p>{books.length ? <button className="text-button" onClick={() => { setQuery(""); setGenre("All genres"); setFavoritesOnly(false); }}>Clear filters</button> : <button className="primary-button" onClick={() => setShowForm(true)}>＋ Add your first book</button>}</div>}
      <div className="collection-footer"><span>SHOWING {visibleBooks.length} OF {books.length} BOOKS</span><span>MADE FOR YOUR NEXT FAVORITE</span></div>
    </section>
    <footer className="site-footer"><span>folio<span className="brand-dot">.</span></span><span>Your reading life, gathered in one place.</span><span>✳</span></footer>
    {notice && <div className="toast" role="status">✓ &nbsp;{notice}</div>}
    {showForm && <AddBook book={editingBook} onClose={() => { setShowForm(false); setEditingBook(null); }} onSave={handleSave} />}
  </main>;
}

export default Homepage;
