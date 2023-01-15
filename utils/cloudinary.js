const cloudinary = require("cloudinary")

cloudinary.config({
  cloud_name: process.env.CLOUD,
  api_key: process.env.CLOUD_APIKEY,
  api_secret: process.env.CLOUD_SECRET,
})

const cloudinaryUploadImg = (file) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(file, (result) => {
      resolve(
        {
          url: result.secure_url,
        },
        { resource_type: "auto" }
      )
    })
  })
}

module.exports = cloudinaryUploadImg