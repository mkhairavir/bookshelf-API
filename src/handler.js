const { nanoid } = require('nanoid');
const bookShelves = require('./bookshelves');
const helper = require('./helper');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return helper.buildResponse(
      h,
      400,
      'Gagal menambahkan buku. Mohon isi nama buku',
    );
  }

  if (readPage > pageCount) {
    return helper.buildResponse(
      h,
      400,
      'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    );
  }

  const id = nanoid(16);
  const finished = readPage === pageCount;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  bookShelves.push(newBook);

  const isSuccess = bookShelves.filter((b) => b.id === newBook.id).length > 0;

  if (isSuccess) {
    return helper.buildResponse(h, 201, 'Buku berhasil ditambahkan', {
      bookId: id,
    });
  }

  return helper.buildResponse(h, 500, 'Gagal Menyimpan buku');
};

const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  let books = bookShelves;

  if (name) {
    books = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    books = books.filter((book) => book.reading === !!Number(finished));
  }

  if (finished !== undefined) {
    books = books.filter((book) => {
      console.log(book.finished);
      return book.finished === !!Number(finished);
    });
  }

  books = books.map((book) => helper.reMapBook(book));

  return helper.buildResponse(h, 200, undefined, { books });
};

const getBookById = (request, h) => {
  const { id } = request.params;

  const book = bookShelves.filter((f) => f.id === id)[0];

  if (book) {
    return helper.buildResponse(h, 200, undefined, { book });
  }

  return helper.buildResponse(h, 404, 'Buku tidak ditemukan');
};

const editBookById = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  if (!name) {
    return helper.buildResponse(
      h,
      400,
      'Gagal memperbarui buku. Mohon isi nama buku',
    );
  }

  if (readPage > pageCount) {
    return helper.buildResponse(
      h,
      400,
      'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    );
  }

  const index = bookShelves.findIndex((book) => book.id === id);

  if (index === -1) {
    return helper.buildResponse(
      h,
      404,
      'Gagal memperbarui buku. Id tidak ditemukan',
    );
  }

  bookShelves[index] = {
    ...bookShelves[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  return helper.buildResponse(h, 200, 'Buku berhasil diperbarui');
};

const deleteBookById = (request, h) => {
  const { id } = request.params;

  const index = bookShelves.findIndex((book) => book.id === id);

  if (index === -1) {
    return helper.buildResponse(
      h,
      404,
      'Buku gagal dihapus. Id tidak ditemukan',
    );
  }

  bookShelves.splice(index, 1);

  return helper.buildResponse(h, 200, 'Buku berhasil dihapus');
};

module.exports = {
  addBookHandler,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
};
