const query = require('querystring');

/*
  Items:
  timestamp: {
    type:"(book|movie)",
    title:"Title",
    by:"Author/Producer",
    liked:(true|false)
  }
*/
// Pre-existing demo data
const media = {
  0: {
    type: 'book',
    title: 'Childhood\'s%20End',
    by: 'Arthur%20C.%20Clarke',
    liked: 'true',
  },
  1: {
    type: 'movie',
    title: 'Bill%20%26%20Ted\'s%20Excellent%20Adventure',
    by: 'No%20idea',
    liked: 'false',
  },
};

// GET API
const getMedia = (request, response) => {
  // Grab params, if any
  const qstr = new URL(request.url, 'http://localhost/').searchParams;

  let data;

  // If has a filter & a param for that filter, then filter it
  // Had to use soe IIFEs here since ESlint flipped out about
  // `let` being block-level and so other cases could access
  if (qstr.has('filter') && qstr.has('i')) {
    switch (qstr.get('filter').toLowerCase()) {
      case 'since':
        // All events since timestamp
        // Did not end up getting used on client-side
        (function () {
          data = {};
          Object.keys(media).forEach((item) => {
            if (item > parseInt(qstr.get('i'), 10)) {
              data[item] = media[item];
            }
          });
        }());
        break;
      case 'one':
        // Get the single event specified
        (function () {
          data = {};
          const ts = parseInt(qstr.get('i'), 10);
          if (media[ts]) {
            data[ts] = media[ts];
          }
        }());
        break;
      case 'limit':
        // Return a max of i events
        // Did not end up geting used on client-side
        (function () {
          const num = parseInt(qstr.get('i'), 10);
          if (Object.keys(media).length > num) {
            data = {};
            Object.keys(media).reverse().slice(0, num).forEach((item) => {
              data[item] = media[item];
            });
          } else {
            data = media;
          }
        }());
        break;
      default:
        // If bad parameters, ignore
        data = media;
    }
  } else {
    // If no parameters, send all data
    data = media;
  }

  // Format data
  const myJson = {
    media: data,
  };
  const jsonString = JSON.stringify(myJson);

  // Send data
  response.writeHead(200, { 'Content-Type': 'application/json' });
  if (request.method === 'GET') {
    // HEAD request check
    response.write(jsonString);
  }
  return response.end();
};

// POST API
const addMedia = (request, response) => {
  // Body chunks
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // Parse POST request
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    // Validate has all fields`
    if (!bodyParams.mediaType || !bodyParams.title || !bodyParams.by || !bodyParams.liked) {
      const myJson = {
        message: 'All fields are required.',
        id: 'Bad Request',
      };
      const jsonString = JSON.stringify(myJson);

      response.writeHead(400, { 'Content-Type': 'application/json' });
      response.write(jsonString);
      return response.end();
    }

    // Get Date object, using timestamp if provided (for updating entry)
    let date = (bodyParams.timestamp
      ? new Date(parseInt(bodyParams.timestamp, 10)).getTime()
      : Date.now()
    );

    // Update entry if exists
    if (media[date] && bodyParams.timestamp) {
      // Updata data
      media[date].type = bodyParams.mediaType;
      media[date].title = bodyParams.title;
      media[date].by = bodyParams.by;
      media[date].liked = bodyParams.liked;

      // Return
      response.writeHead(204, { 'Content-Type': 'application/json' });
      return response.end();
    } if (bodyParams.timestamp) {
      // User trying to fudge data, shame on them
      date = Date.now();
    }

    // Add new data
    media[date] = {};
    media[date].type = bodyParams.mediaType;
    media[date].title = bodyParams.title;
    media[date].by = bodyParams.by;
    media[date].liked = bodyParams.liked;

    // Format response
    const myJson = {
      message: 'Created Successfully',
      id: 'Create',
    };
    const jsonString = JSON.stringify(myJson);

    // Send response
    response.writeHead(201, { 'Content-Type': 'application/json' });
    response.write(jsonString);
    return response.end();
  });
};

// Event stream for updates
// Does not handle updates, just new entries
const getFeed = (request, response) => {
  // Tell browser it's a stream
  response.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  });

  // Keep track of last entry sent to browser
  let last = Object.keys(media).reverse()[0];

  // Continually send updates every 3 seconds
  // Normally would use a comment to do keep alive,
  // but got errors so sends blank array which
  // silently does nothing on the client side
  setInterval(() => {
    const data = {};
    data.updates = [];

    // Determine all new entries since last update
    Object.keys(media).forEach((item) => {
      if (item > last) {
        data.updates.push(item);
      }
    });

    // Format data
    const myJson = { data };
    const jsonString = JSON.stringify(myJson);

    // Send updates
    response.write(`data: ${jsonString}\n\n`);

    // Update last. Had to use array deconstruction
    // to appease ESlint
    [last] = Object.keys(media).reverse();
  }, 3000);
  // ^ 3-second interval defined here

  // Close stream when browser does
  request.on('close', () => {
    response.end();
  });
};

module.exports = {
  getMedia,
  addMedia,
  getFeed,
};
