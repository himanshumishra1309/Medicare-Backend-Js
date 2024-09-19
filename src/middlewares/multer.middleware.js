import multer from "multer";
//Remember to read the documentation of multer

//we are using diskstorage to save the files, here cb stabns for callbacks whose first parameter should always be null
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Timestamp + random number
        cb(null, uniqueSuffix + '-' + file.originalname); // Prepend unique value to the original filename
    }
})


//we could have also written this in order to give a unique name to each file:
// filename: function(req, file, cb){
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Add timestamp + random number
//     cb(null, uniqueSuffix + '-' + file.originalname); // Prepend unique value to the original filename
// }

export const upload = multer({storage})