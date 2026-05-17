import multer from "multer";

const errormiddleware = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
    });
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size must be below 5MB",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err.message === "Only PDF files are allowed") {
    return res.status(400).json({
      success: false,
      message: "Only PDF files are allowed",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};

export default errormiddleware;
