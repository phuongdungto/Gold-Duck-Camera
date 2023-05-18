const multer = require('multer');
const path = require('path');
const { BadRequest } = require('http-errors');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../../public/product/image'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    },
})
function createMulter({ allowFileTypes, maxFileSize }) {
    // console.log(__dirname)
    // console.log(path.join(__dirname, '../../../public/product/image'))
    return multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            if (maxFileSize && file.size >= maxFileSize) {
                cb(new BadRequest(`Only allow size less than ${maxFileSize / 1_000_000}`));
            }

            if (allowFileTypes) {
                // Check ext
                const extname = allowFileTypes.test(path.extname(file.originalname).toLowerCase());
                // Check mimetype
                const mimetype = allowFileTypes.test(file.mimetype);

                if (mimetype && extname) {
                    return cb(null, true);
                } else {
                    cb(new BadRequest('Only allow images'));
                }
            }

        }
    });
}
const productImageUpload = createMulter({ allowFileTypes: /jpeg|jpg|png|gif/, maxFileSize: 10_000_000 })
module.exports = {
    productImageUpload
};

