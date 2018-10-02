const http = require('http');
const url = require('url');
const responseStaticHandler = require('./responsesStatic.js');
const responseDataHandler = require('./responsesData.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  404: responseStaticHandler.get404,
  '/': responseStaticHandler.getIndex,
  '/style.css': responseStaticHandler.getStyle,
  '/getFeed': responseDataHandler.getMedia,
  '/addReview': responseDataHandler.addMedia,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response);
  } else {
    urlStruct['404'](request, response);
  }
};

http.createServer(onRequest).listen(port);
console.log(`Listening on port ${port}`);
