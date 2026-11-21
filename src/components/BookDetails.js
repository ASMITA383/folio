import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDate, getBooks } from "../books";
import "./BookDetails.css";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = useMemo(() => getBooks().find((item) => item.id === id), [id]);
  if (!book) return <main className="not-found"><Link className="brand" to="/">folio<span className="brand-dot">.</span></Link><div className="eyebrow">SHELF NOT FOUND</div><h1>This story wandered off.</h1><p>It may have been removed from your library.</p><Link className="primary-button" to="/">Back to your bookshelf ↗</Link></main>;
  return <main className="details-page"><header className="topbar"><Link className="brand" to="/"><span className="brand-mark">f</span> folio<span className="brand-dot">.</span></Link><span className="topbar-note">YOUR PERSONAL READING ROOM</span><Link className="details-back" to="/">← Back to bookshelf</Link></header><article className="detail-layout"><div className="detail-cover" style={book.cover ? { backgroundImage: `url("${book.cover.replaceAll('"', '%22')}")` } : undefined}>{!book.cover && <span>{book.title.split(/\s+/).slice(0, 3).map((w) => w[0]).join("")}</span>}</div><div className="detail-copy"><div className="eyebrow">{book.genre || "FROM YOUR COLLECTION"}</div><h1>{book.title}</h1><p className="detail-author">by <strong>{book.author || "Unknown author"}</strong></p><div className="detail-rating"><span>{"★".repeat(Math.round(Number(book.rating) || 0))}{"☆".repeat(5 - Math.round(Number(book.rating) || 0))}</span>{Number(book.rating) > 0 ? <b>{Number(book.rating).toFixed(1)} <small>/ 5</small></b> : <small>Not rated yet</small>}</div><div className="detail-rule"/><div className="detail-meta"><div><span>PUBLISHED</span><strong>{formatDate(book.publishedDate)}</strong></div><div><span>PUBLISHER</span><strong>{book.publisher || "Not listed"}</strong></div></div><section className="detail-description"><div className="eyebrow">A LITTLE ABOUT IT</div><p>{book.content || "No notes or description yet. You can add a synopsis or your thoughts by editing this book."}</p></section><button className="text-button" onClick={() => navigate("/", { state: { editId: book.id } })}>← Return to your shelf</button></div></article></main>;
}

export default BookDetails;
