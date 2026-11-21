import "./DeleteAlert.css";
function DeleteAlert({ setIsDeleteAlertOpen, deletingBook, setBookList }) {
  const handleBookDelete = (wantToDelete) => {
    if (wantToDelete) {
      fetch(`http://localhost:8080/api/books/${deletingBook.id}`, {
        method: "DELETE",
      })
        .then(
          setBookList((books) =>
            books.filter((book) => book.id !== deletingBook.id),
          ),
        )
        .then(console.log("deleted successfully"))
        .catch((err) => console.error(err));
    } else {
      setIsDeleteAlertOpen(false);
    }

    setIsDeleteAlertOpen(false);
  };

  return (
    <>
      <div className="deletebook-alert-container">
        <div classname="clos-btn-container">
          <button
            onClick={() => setIsDeleteAlertOpen(false)}
            className="alert-close-btn"
          >
            &times;
          </button>
        </div>
        <div>
          <h5>Do you want to delete {deletingBook.title} ?</h5>
        </div>

        <div className="delete-options">
          <button
            value={true}
            className="option yes"
            onClick={() => handleBookDelete(true)}
          >
            Yes
          </button>
          <button
            value={false}
            className="option no"
            onClick={() => handleBookDelete(false)}
          >
            No
          </button>
        </div>
      </div>
      <div className="overlay"></div>
    </>
  );
}

export default DeleteAlert;
