const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const getIndex = (request, response) => {
  // Send index.html
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  return response.end();
};

const getStyle = (request, response) => {
  // Send style.css
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  return response.end();
};

const get404 = (request, response) => {
  // Send 404 for pages not found
  const myJson = {
    message: 'The page you are looking for was not found.',
    id: 'Resource Not Found',
  };

  const jsonString = JSON.stringify(myJson);

  response.writeHead(404, { 'Content-Type': 'application/json' });
  if (request.method === 'GET') {
    response.write(jsonString);
  }
  return response.end();
};

module.exports = {
  getIndex,
  getStyle,
  get404,
};
