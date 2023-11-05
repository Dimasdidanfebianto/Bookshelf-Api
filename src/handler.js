const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const insertedAt = createdAt;
  const finished = pageCount === readPage;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, createdAt, updatedAt, insertedAt
  };

  books.push(newBook);

  const isSuccess = books.find((book) => book.id === id);

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name } = request.query;
  const { reading = false, finished = false } = request.query;

  if (reading) {
    const filteredBooks = books.filter(book =>
      book.reading === (reading === '1')
    );

    const simplifiedBooks = filteredBooks.map(book => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    return {
      status: 'success',
      data: {
        books: simplifiedBooks,
      },
    };
  }

  if (name) {
    const filteredBooks = books.filter(book =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );

    const simplifiedBooks = filteredBooks.map(book => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    return {
      status: 'success',
      data: {
        books: simplifiedBooks,
      },
    };
  }

  return {
    status: 'success',
    data: {
      books: books.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.find((n) => n.id === id);

  if (book) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

const updateBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  const index = books.findIndex((note) => note.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name, year, author, summary, publisher, pageCount, readPage, reading, finished, updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((note) => note.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler
};
  