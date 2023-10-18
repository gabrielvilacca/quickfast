const functions = require("firebase-functions");
const admin = require("firebase-admin");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const sendEventToFacebook = require("./actions/sendEventToFacebook");
const {
  createContactOnMailchimp,
  updateContactTagsOnMailchimp,
} = require("./actions/sendEventToMailchimp");
const { getUniqueId } = require("./utils/getUniqueId");

// TODO: Definir a sua chave de API do Mailchimp como variável de configuração
mailchimp.setConfig({
  apiKey: functions.config().mailchimp.api_key,
  server: "us12", // Alterar pelo servidor da sua conta (últimos 4 caracteres da sua chave de API)
});

if (admin.apps.length === 0) {
  admin.initializeApp();
}

exports.onUserCreate = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snap, context) => {
    const userData = snap.data();
    userData.event_name = "Lead";
    userData.event_id = getUniqueId();
    userData.action_source = "website";
    userData.event_source_url = `https://${userData.origin}`;

    const promises = [
      createContactOnMailchimp(mailchimp, listId, userData),
      sendEventToFacebook(userData),
    ];

    const results = await Promise.allSettled(promises);

    const subscriberHash = results[0].value;

    if (results[1].status === "rejected") {
      console.error("Erro ao enviar evento para o Facebook", results[1].reason);
    }

    try {
      await snap.ref.update({
        fbc: admin.firestore.FieldValue.delete(),
        fbp: admin.firestore.FieldValue.delete(),
        user_agent: admin.firestore.FieldValue.delete(),
      });
    } catch (error) {
      console.error("Erro ao deletar campos do usuário", error);
    }

    if (results[0].status === "rejected") {
      console.error("Erro ao criar contato no Mailchimp", results[0].reason);
      return { success: false, message: "Error creating contact" };
    }

    await updateContactTagsOnMailchimp(subscriberHash, [
      { name: "lead", status: "active" },
    ]);

    return {
      success: true,
      message: "Successfully created contact " + userData.email,
    };
  });
