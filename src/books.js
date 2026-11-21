const STORAGE_KEY = "folio.books.v1";

const starterBooks = [
  { id: "sample-1", title: "The Midnight Library", author: "Matt Haig", publisher: "Canongate Books", publishedDate: "2020-08-13", content: "Between life and death there is a library, and within that library, the shelves go on forever. Every book offers a chance to try another life you could have lived.", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=85", rating: 4.5, genre: "Fiction", favorite: false },
  { id: "sample-2", title: "Atomic Habits", author: "James Clear", publisher: "Avery", publishedDate: "2018-10-16", content: "A practical guide to building good habits, breaking bad ones, and getting 1% better every day through small, repeatable changes.", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=85", rating: 4.8, genre: "Personal growth", favorite: false },
  { id: "sample-3", title: "Tomorrow, and Tomorrow, and Tomorrow", author: "Gabrielle Zevin", publisher: "Knopf", publishedDate: "2022-07-05", content: "A luminous story about friendship, creativity, and the worlds we build together, following two friends who make video games across decades.", cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=700&q=85", rating: 4.6, genre: "Literary fiction", favorite: false },
  { id: "sample-4", title: "The Creative Act", author: "Rick Rubin", publisher: "Penguin Press", publishedDate: "2023-01-17", content: "A generous course in creative practice: noticing, listening, and making room for the work that wants to come through you.", cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=700&q=85", rating: 4.4, genre: "Creativity", favorite: false },
];

export function getBooks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(starterBooks));
      return starterBooks;
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((book) => book && book.id) : starterBooks;
  } catch {
    return starterBooks;
  }
}

export function saveBooks(books) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    return true;
  } catch {
    return false;
  }
}

export function createBookId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `book-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatDate(value) {
  if (!value) return "Date unknown";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? "Date unknown" : new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric" }).format(date);
}
