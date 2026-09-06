const { success } = require("../utils/response");

function getHealth(req, res) {
  res.status(200).json(
    success({
      data: {
        service: "task-api",
        status: "ok",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
      },
    })
  );
}

module.exports = {
  getHealth,
};
