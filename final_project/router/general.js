const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  // Add the new user to the users array
  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
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

// Task 11 - Get book details by ISBN using Promise callbacks
public_users.get("/isbn-promise/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  
  // Create a Promise to fetch book details by ISBN
  const getBookByISBNPromise = new Promise((resolve, reject) => {
    // Simulate async operation
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject(new Error("Book not found"));
      }
    }, 100);
  });

  // Using Promise callbacks (.then() and .catch())
  getBookByISBNPromise
    .then((bookData) => {
      res.send(JSON.stringify(bookData, null, 4));
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
    });
});

// Task 11 - Get book details by ISBN using async-await
public_users.get("/isbn-async/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  
  try {
    // Function that returns a Promise
    const getBookByISBNAsync = (isbn) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books[isbn]) {
            resolve(books[isbn]);
          } else {
            reject(new Error("Book not found"));
          }
        }, 100);
      });
    };

    // Using async-await
    const bookData = await getBookByISBNAsync(isbn);
    res.send(JSON.stringify(bookData, null, 4));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Task 11 - Get book details by ISBN using axios with Promise callbacks
public_users.get("/isbn-axios-promise/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const url = `http://localhost:${process.env.PORT || 5000}/isbn/${isbn}`;
  
  // Using axios with Promise callbacks
  axios.get(url)
    .then((response) => {
      res.send(JSON.stringify(response.data, null, 4));
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        res.status(404).json({ message: "Book not found" });
      } else {
        res.status(500).json({ 
          message: "Error fetching book details via axios", 
          error: error.message 
        });
      }
    });
});

// Task 11 - Get book details by ISBN using axios with async-await
public_users.get("/isbn-axios-async/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  
  try {
    const url = `http://localhost:${process.env.PORT || 5000}/isbn/${isbn}`;
    
    // Using axios with async-await
    const response = await axios.get(url);
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: "Book not found" });
    } else {
      res.status(500).json({ 
        message: "Error fetching book details via axios", 
        error: error.message 
      });
    }
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

// Task 12 - Get book details by Author using Promise callbacks
public_users.get("/author-promise/:author", function (req, res) {
  const author = req.params.author;
  
  // Create a Promise to fetch books by author
  const getBooksByAuthorPromise = new Promise((resolve, reject) => {
    // Simulate async operation
    setTimeout(() => {
      const bookKeys = Object.keys(books);
      let matchingBooks = [];

      // Find books by the specified author
      bookKeys.forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          matchingBooks.push(books[key]);
        }
      });

      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject(new Error("No books found by this author"));
      }
    }, 100);
  });

  // Using Promise callbacks (.then() and .catch())
  getBooksByAuthorPromise
    .then((booksData) => {
      res.send(JSON.stringify(booksData, null, 4));
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
    });
});

// Task 12 - Get book details by Author using async-await
public_users.get("/author-async/:author", async function (req, res) {
  const author = req.params.author;
  
  try {
    // Function that returns a Promise
    const getBooksByAuthorAsync = (author) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const bookKeys = Object.keys(books);
          let matchingBooks = [];

          // Find books by the specified author
          bookKeys.forEach((key) => {
            if (books[key].author.toLowerCase() === author.toLowerCase()) {
              matchingBooks.push(books[key]);
            }
          });

          if (matchingBooks.length > 0) {
            resolve(matchingBooks);
          } else {
            reject(new Error("No books found by this author"));
          }
        }, 100);
      });
    };

    // Using async-await
    const booksData = await getBooksByAuthorAsync(author);
    res.send(JSON.stringify(booksData, null, 4));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Task 12 - Get book details by Author using axios with Promise callbacks
public_users.get("/author-axios-promise/:author", function (req, res) {
  const author = req.params.author;
  const url = `http://localhost:${process.env.PORT || 5000}/author/${author}`;
  
  // Using axios with Promise callbacks
  axios.get(url)
    .then((response) => {
      res.send(JSON.stringify(response.data, null, 4));
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        res.status(404).json({ message: "No books found by this author" });
      } else {
        res.status(500).json({ 
          message: "Error fetching books by author via axios", 
          error: error.message 
        });
      }
    });
});

// Task 12 - Get book details by Author using axios with async-await
public_users.get("/author-axios-async/:author", async function (req, res) {
  const author = req.params.author;
  
  try {
    const url = `http://localhost:${process.env.PORT || 5000}/author/${author}`;
    
    // Using axios with async-await
    const response = await axios.get(url);
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: "No books found by this author" });
    } else {
      res.status(500).json({ 
        message: "Error fetching books by author via axios", 
        error: error.message 
      });
    }
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

// Task 10 - Get all books using Promise callbacks
public_users.get("/books-promise", function (req, res) {
  // Simulate fetching books using a Promise
  const getBooksPromise = new Promise((resolve, reject) => {
    // Simulate async operation
    setTimeout(() => {
      if (books) {
        resolve(books);
      } else {
        reject(new Error("Unable to fetch books"));
      }
    }, 100);
  });

  // Using Promise callbacks (.then() and .catch())
  getBooksPromise
    .then((booksData) => {
      res.send(JSON.stringify(booksData, null, 4));
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching books", error: error.message });
    });
});

// Task 10 - Get all books using async-await
public_users.get("/books-async", async function (req, res) {
  try {
    // Function that returns a Promise
    const getBooksAsync = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books) {
            resolve(books);
          } else {
            reject(new Error("Unable to fetch books"));
          }
        }, 100);
      });
    };

    // Using async-await
    const booksData = await getBooksAsync();
    res.send(JSON.stringify(booksData, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 10 - Get all books using axios with Promise callbacks
public_users.get("/books-axios-promise", function (req, res) {
  // Simulate external API call with axios (using localhost as example)
  const url = `http://localhost:${process.env.PORT || 5000}/`;
  
  // Using axios with Promise callbacks
  axios.get(url)
    .then((response) => {
      res.send(JSON.stringify(response.data, null, 4));
    })
    .catch((error) => {
      res.status(500).json({ 
        message: "Error fetching books via axios", 
        error: error.message 
      });
    });
});

// Task 10 - Get all books using axios with async-await
public_users.get("/books-axios-async", async function (req, res) {
  try {
    const url = `http://localhost:${process.env.PORT || 5000}/`;
    
    // Using axios with async-await
    const response = await axios.get(url);
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching books via axios", 
      error: error.message 
    });
  }
});

module.exports.general = public_users;
