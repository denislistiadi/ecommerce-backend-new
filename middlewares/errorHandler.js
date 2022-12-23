// Not found
const notFound = (req, res, next) => {
  const err = new Error(`Not Found: ${req.originalUrl}`)
  res.status(404)
  next(err)
}

//  error handler
const errorHandler = (err, req, res, next) => {
  const status = req.statusCode == 200 ? 500 : res.statusCode
  res.status(status)
  res.json({ message: err?.message, stack: err?.stack })
}

module.exports = { notFound, errorHandler }
