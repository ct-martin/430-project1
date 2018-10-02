const query = require('querystring');

/*
  Items:
  "timestamp": {
    type:"(book|movie)",
    title:"Title",
    by:"Author/Producer",
    liked:(true|false)
  }
*/
const media = {
  0: {
    type: 'book',
    title: "Childhood's End",
    by: 'Arthur C. Clarke',
    liked: 'true',
  },
  1: {
    type: 'movie',
    title: 'Bill and Ted\'s Excellent Adventure',
    by: 'No idea',
    lined: 'false',
  }
};

const getMedia = (request, response) => {
  const myJson = {
    media,
  };

  const jsonString = JSON.stringify(myJson);

  response.writeHead(200, { 'Content-Type': 'application/json' });
  if (request.method === 'GET') {
    response.write(jsonString);
  }
  return response.end();
};

const addMedia = (request, response) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    if (!bodyParams.mediaType || !bodyParams.title || !bodyParams.by || !bodyParams.liked) {
      const myJson = {
        message: 'Name and age are both required.',
        id: 'Bad Request',
      };

      const jsonString = JSON.stringify(myJson);

      response.writeHead(400, { 'Content-Type': 'application/json' });
      response.write(jsonString);
      return response.end();
    }

    const date = Date.now();

    /* if (media[date]) {
      response.writeHead(204, { 'Content-Type': 'application/json' });
      return response.end();
    } */

    media[date] = {};
    media[date].type = bodyParams.mediaType;
    media[date].title = bodyParams.title;
    media[date].by = bodyParams.by;
    media[date].liked = bodyParams.liked;

    const myJson = {
      message: 'Created Successfully',
      id: 'Create',
    };

    const jsonString = JSON.stringify(myJson);

    response.writeHead(201, { 'Content-Type': 'application/json' });
    response.write(jsonString);
    return response.end();
  });
};

module.exports = {
  getMedia,
  addMedia,
};
