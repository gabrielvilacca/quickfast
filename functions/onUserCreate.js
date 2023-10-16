const functions = require("firebase-functions");
const admin = require("firebase-admin");
const mailchimp = require("@mailchimp/mailchimp_marketing");

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
    const email = userData.email;

    // Alterar pelo ID da sua audiência no Mailchimp
    const listId = "14ac8d6a41";

    const subscribingUser = {
      firstName: userData.name.split(" ")[0],
      lastName: userData.name.split(" ")[1],
      email,
    };

    // Função que atualiza as tags do contato no Mailchimp
    async function updateTags(subscriberHash, tags) {
      const response = await mailchimp.lists.updateListMemberTags(
        listId,
        subscriberHash,
        {
          tags: [...tags],
        }
      );

      console.log(
        `The return type for this endpoint is null, so this should be true: ${
          response === null
        }`
      );
    }

    async function createContact() {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
        },
      });

      console.log(
        `Successfully added contact as an audience member. The contact's id is ${response.id}.`
      );

      return response.id;
    }

    // Função para atualizar os MERGE_FIELDS no Mailchimp
    async function updateMember() {
      const response = await mailchimp.lists.updateListMember(
        "list_id",
        "subscriber_hash",
        {
          merge_fields: {
            PLAN: "PRO",
          },
        }
      );
    }

    try {
      const subscriberHash = await createContact();
      await updateTags(subscriberHash, [
        { name: "teste", status: "active" },
        { name: "teste2", status: "active" },
      ]);
    } catch (error) {
      console.error("Erro ao adicionar usuário ao Mailchimp", error);
    }
  });
