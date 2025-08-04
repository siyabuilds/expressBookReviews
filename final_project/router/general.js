const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  // Return the books list using JSON.stringify for neat display
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  // Retrieve the ISBN from request parameters
  const isbn = req.params.isbn;

  // Check if the book exists
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  // Get the author from request parameters
  const author = req.params.author;

  // Get all the keys for the 'books' object
  const bookKeys = Object.keys(books);

  // Array to store matching books
  let matchingBooks = [];

  // Iterate through the 'books' array & check if author matches
  bookKeys.forEach((key) => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push(books[key]);
    }
  });

  // Check if any books were found
  if (matchingBooks.length > 0) {
    res.send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  // Get the title from request parameters
  const title = req.params.title;

  // Get all the keys for the 'books' object
  const bookKeys = Object.keys(books);

  // Array to store matching books
  let matchingBooks = [];

  // Iterate through the 'books' array & check if title matches
  bookKeys.forEach((key) => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks.push(books[key]);
    }
  });

  // Check if any books were found
  if (matchingBooks.length > 0) {
    res.send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  // Get the ISBN from request parameters
  const isbn = req.params.isbn;

  // Check if the book exists
  if (books[isbn]) {
    // Get the book reviews based on ISBN
    const bookReviews = books[isbn].reviews;
    res.send(JSON.stringify(bookReviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
