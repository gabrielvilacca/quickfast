const functions = require("firebase-functions");
const mailchimp = require("@mailchimp/mailchimp_transactional")(
  "md-_9ALJ-tbpD_qaEZCI3gpUg"
);

exports.sendInvite = functions.https.onRequest(async (req, res) => {
  const { email, teamId, role } = req.body;

  if (!email || !teamId || !role) {
    return res.status(400).send("Missing required fields");
  }

  const inviteLink = `https://your-app.com/invite?teamId=${teamId}&role=${role}`;

  const message = {
    from_email: "noreply@your-app.com",
    subject: "Convite para se juntar ao time",
    text: `Você foi convidado para se juntar ao time. Clique no link para aceitar o convite: ${inviteLink}`,
    to: [
      {
        email: email,
        type: "to",
      },
    ],
  };

  try {
    const response = await mailchimp.messages.send({
      message: message,
    });
    console.log(response);
    res.status(200).send("Convite enviado com sucesso");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao enviar convite");
  }
});
