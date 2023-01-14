const bodyParser = require("body-parser")
const express = require("express")
const dbConnect = require("./config/dbConnect")
const { notFound, errorHandler } = require("./middlewares/errorHandler")
const app = express()
const dotenv = require("dotenv").config()
const PORT = process.env.PORT || 4000
const cookieParser = require("cookie-parser")
const morgan = require("morgan")

const authRouter = require("./routes/authRoute")

const productRouter = require("./routes/productRoute")
const categoryRouter = require("./routes/prodCategoryRoute")
const brandRouter = require("./routes/brandRoute")

const blogRouter = require("./routes/blogRoute")
const blogCategoryRouter = require("./routes/blogCategoryRoute")

// connect DB
dbConnect()

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())

// Routes
app.use("/api/user", authRouter)
app.use("/api/product", productRouter)
app.use("/api/blog", blogRouter)
app.use("/api/category", categoryRouter)
app.use("/api/blog-category", blogCategoryRouter)
app.use("/api/brand", brandRouter)

// handler middleware
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`)
})
