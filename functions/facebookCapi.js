const functions = require("firebase-functions");
const sendEventToFacebook = require("./actions/sendEventToFacebook");
const cors = require("cors")({ origin: true });

exports.facebookCapi = functions.https.onRequest((req, res) => {
  // Wrap the entire function logic in cors middleware
  cors(req, res, async () => {
    // get ip address from the request
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    console.log(req.body);

    const response = await sendEventToFacebook(req.body, ipAddress);

    res.status(200).send({
      success: true,
      message: response,
    });
  });
});
