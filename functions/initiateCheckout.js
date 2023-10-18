const functions = require("firebase-functions");
const sendEventToFacebook = require("./actions/sendEventToFacebook");
const {
  ensureContact,
  updateContactTagsOnMailchimp,
} = require("./actions/sendEventToMailchimp");
const cors = require("cors")({ origin: true });

exports.initiateCheckout = functions.https.onRequest((req, res) => {
  // Wrap the entire function logic in cors middleware
  cors(req, res, async () => {
    // get ip address from the request
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const promises = [
      ensureContact(req.body),
      sendEventToFacebook(req.body, ipAddress),
    ];

    const results = await Promise.allSettled(promises);
    const subscriberHash = results[0].value;

    if (results[1].status === "rejected") {
      console.error("Erro ao enviar evento para o Facebook", results[1].reason);
    }

    if (results[0].status === "rejected") {
      console.error("Erro ao criar contato no Mailchimp", results[0].reason);
      return res.status(500).json({
        success: false,
        message: "Error creating contact",
      });
    }

    try {
      await updateContactTagsOnMailchimp(subscriberHash, [
        { name: "lead", status: "active" },
        { name: "initiate checkout", status: "active" },
      ]);
    } catch (error) {
      console.error("Erro ao atualizar tags no Mailchimp", error);
    }

    res.status(200).send({
      success: true,
      message: "Successfully created contact and sent event to Facebook",
    });
  });
});
