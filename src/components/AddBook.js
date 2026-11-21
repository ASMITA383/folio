import { useEffect, useState } from "react";
import "./AddBook.css";

const emptyBook = { title: "", author: "", publisher: "", publishedDate: "", genre: "", content: "", cover: "", rating: 0 };

function AddBook({ book, onClose, onSave }) {
  const [form, setForm] = useState(() => book ? { ...emptyBook, ...book } : emptyBook);
  const [error, setError] = useState("");
  const [readingFile, setReadingFile] = useState(false);

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("modal-open");
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.classList.remove("modal-open"); };
  }, [onClose]);

  function change(event) { setForm((previous) => ({ ...previous, [event.target.name]: event.target.value })); }

  function uploadCover(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Choose an image file for the cover."); return; }
    if (file.size > 1024 * 1024) { setError("Cover images must be 1 MB or smaller so your library stays quick to load."); event.target.value = ""; return; }
    setReadingFile(true);
    const reader = new FileReader();
    reader.onload = () => { setForm((previous) => ({ ...previous, cover: String(reader.result) })); setReadingFile(false); setError(""); };
    reader.onerror = () => { setError("That image could not be read. Try another file."); setReadingFile(false); };
    reader.readAsDataURL(file);
  }

  function submit(event) {
    event.preventDefault();
    const title = form.title.trim();
    const author = form.author.trim();
    if (!title || !author) { setError("Add a title and author to save this book."); return; }
    if (form.publishedDate && (Number.isNaN(Date.parse(`${form.publishedDate}T00:00:00`)) || form.publishedDate > new Date().toISOString().slice(0, 10))) { setError("Enter a valid publication date that is not in the future."); return; }
    if (form.cover && !form.cover.startsWith("data:image/") && !/^https?:\/\//i.test(form.cover)) { setError("Cover URL must begin with http:// or https://."); return; }
    onSave({ ...form, title, author, publisher: form.publisher.trim(), genre: form.genre.trim(), content: form.content.trim(), rating: Math.min(5, Math.max(0, Number(form.rating) || 0)) });
  }

  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="book-modal" role="dialog" aria-modal="true" aria-labelledby="form-title"><header className="modal-header"><div><div className="eyebrow">YOUR PERSONAL COLLECTION</div><h2 id="form-title">{book ? "Edit this book" : "Add to your shelf"}</h2><p>Every detail helps your collection feel like yours.</p></div><button type="button" className="modal-close" onClick={onClose} aria-label="Close">×</button></header>
    <form onSubmit={submit} noValidate><div className="form-layout"><div className="form-fields"><label>Book title <span>*</span><input autoFocus name="title" value={form.title} onChange={change} maxLength={120} placeholder="e.g. The Midnight Library" required /></label><label>Author <span>*</span><input name="author" value={form.author} onChange={change} maxLength={100} placeholder="e.g. Matt Haig" required /></label><div className="form-row"><label>Publisher<input name="publisher" value={form.publisher} onChange={change} maxLength={100} placeholder="Publisher name" /></label><label>Published on<input name="publishedDate" type="date" value={form.publishedDate || ""} onChange={change} max={new Date().toISOString().slice(0, 10)} /></label></div><div className="form-row"><label>Genre<input name="genre" value={form.genre} onChange={change} maxLength={40} placeholder="e.g. Fiction" /></label><label>Your rating <span className="optional">OPTIONAL</span><select name="rating" value={form.rating} onChange={change}><option value="0">Not rated</option>{[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((rating) => <option value={rating} key={rating}>{rating} ★</option>)}</select></label></div><label>About this book<textarea name="content" value={form.content} onChange={change} rows="4" maxLength={1200} placeholder="A short synopsis, your notes, or what you loved…" /><span className="char-count">{form.content.length}/1200</span></label></div>
      <aside className="cover-field"><div className="cover-preview" style={form.cover ? { backgroundImage: `url("${form.cover.replaceAll('"', '%22')}")` } : undefined}>{!form.cover && <div><span>✳</span><small>COVER PREVIEW</small></div>}</div><label className="cover-label">Cover image <span className="optional">OPTIONAL</span><input type="url" name="cover" value={form.cover.startsWith("data:image/") ? "" : form.cover} onChange={change} placeholder="Paste image URL" /></label><label className="upload-button">{readingFile ? "Reading image…" : "↑ Upload an image"}<input type="file" accept="image/*" onChange={uploadCover} /></label><small className="upload-note">JPG, PNG or WebP · up to 1 MB</small>{form.cover && <button type="button" className="remove-cover" onClick={() => setForm((prev) => ({ ...prev, cover: "" }))}>Remove cover</button>}</aside></div>
      {error && <div className="form-error" role="alert">{error}</div>}<footer className="modal-actions"><span><span>*</span> Required fields</span><div><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button" disabled={readingFile}>{book ? "Save changes" : "Add to my shelf"} <span>↗</span></button></div></footer>
    </form></section></div>;
}

export default AddBook;
