const multer  = require('multer')

const upload = multer({ dest: 'uploads/' })   
const multMid = upload.single("postImage")


module.exports = multMid