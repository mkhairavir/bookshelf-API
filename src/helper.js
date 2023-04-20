const buildResponse = (h, statusCode, message, data) => {
  let status = '';

  if (statusCode >= 200 && statusCode <= 299) {
    status = 'success';
  } else {
    status = 'fail';
  }

  const response = h.response({
    status,
    message,
    data,
  });

  response.code(statusCode);
  return response;
};

const reMapBook = (book) => ({
  id: book.id,
  name: book.name,
  publisher: book.publisher,
});

module.exports = { buildResponse, reMapBook };
