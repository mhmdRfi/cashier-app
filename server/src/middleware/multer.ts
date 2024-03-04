import path from "path"
import multer from "multer"

const avatarStorage = multer.diskStorage({
  destination: (req : Express.Request, res : Express.Response, cb) : void => {
    cb(null, path.join(__dirname, "../../public/images/avatar"))
  },
  filename: (req : Express.Request, file : Express.Multer.File, cb) : void => {
    cb(null, `avatar_${Date.now()}-${file.originalname}`)
  }
})

const fileFilter = (req: Express.Request, file : Express.Multer.File, cb : any) : void => {
  const fileType = file.mimetype.split("/")[1];
  if(
    fileType === "png" || 
    fileType === "jpg" || 
    fileType === "jpeg" || 
    fileType === "gif"
  ) {
    cb(null, true)
  } else {
    cb("File type not allowed", false)
  }
}

const limits = {
  fileSize : 1024 * 1024,
}

export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter,
  limits
}).single("avatar")