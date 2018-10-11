# Media Review Tracker

## What & why
This site is a social media-like tracker for book & movie reviews.
The inspiration for this was me going on a sci-fi binge lately.

## API
The API handles creating, getting, & updating reviews.

## What went right or wrong?
Babel uses an eval(), so it effectively acts as an IIFE.
This made calling functions to debug & test a pain.
Additionally had to make changes to the API a couple times to meet the above & beyond.
Also, ESlint has some annoying rules, such as flipping out if you use `[0]` to get the first item in an array.

## Future improvements
* Making the event stream smarter, particularly:
  * proper keep-alive
  * retrying on error
  * not rebuilding the feed entirely for new items.
* AJAX fallback for event stream
* Indication to user that the stream hasn't died
* Use the API's "limit" filter on initial load

# Above & Beyond
* Used an event stream to send updates to the client

# External code used
* Event stream tutorial: https://medium.com/conectric-networks/a-look-at-server-sent-events-54a77f8d6ff7
* Bootstrap
  * jQuery
  * Popper
* Font Awesome
