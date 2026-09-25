const createReturn = async (req, res) => {
  try {
    const returnData = req.body;

    res.status(201).json({
      message: "Return request created",
      data: returnData,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createReturn,
};