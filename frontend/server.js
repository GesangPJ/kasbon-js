const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// Use process.env.PORT to specify the port, with a fallback to 3000 if not set
const port = process.env.PORT || 3000

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname } = parsedUrl

    handle(req, res, parsedUrl)
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`)
    console.log(`NODE_ENV=${process.env.NODE_ENV}`)
    console.log(`PORT : ${port}`)
  })
})
