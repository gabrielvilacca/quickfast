const functions = require("firebase-functions");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require("md5");

mailchimp.setConfig({
  apiKey: functions.config().mailchimp.api_key,
  server: "us14",
});

const listId = "5c539e1742";

async function createContactOnMailchimp(userData) {
  const { email, name, phone, utm, origin, sck } = userData;
  const { utm_campaign, utm_source, utm_medium, utm_content, utm_term } = utm;

  const response = await mailchimp.lists.addListMember(listId, {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: name.split(" ")[0],
      LNAME: name.split(" ")[1],
      PHONE: phone,
      ORIGIN: origin,
      CAMPAIGN: utm_campaign,
      SOURCE: utm_source,
      MEDIUM: utm_medium,
      CONTENT: utm_content,
      TERM: utm_term,
      SCK: sck,
    },
  });

  console.log(
    `Successfully added contact as an audience member. The contact's id is ${response.id}.`
  );

  return response.id;
}

async function updateContactTagsOnMailchimp(subscriberHash, tags) {
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

async function updateContactMergeFieldsOnMailchimp() {
  const response = await mailchimp.lists.updateListMember(
    "list_id",
    "subscriber_hash",
    {
      merge_fields: {
        PLAN: "PRO",
      },
    }
  );

  return response;
}

async function ensureContact(body) {
  const {
    email,
    name,
    phone,
    origin,
    utm_campaign,
    utm_source,
    utm_medium,
    utm_content,
    utm_term,
    sck,
  } = body;
  // Crie um hash MD5 do e-mail
  const subscriberHash = md5(email.toLowerCase());

  try {
    // Tentativa de obter o membro
    await mailchimp.lists.getListMember(listId, subscriberHash);

    // se chegou aqui é porque existe, senão vai pro catch 404
    // update member with new data
    console.log("phone => ", phone);
    const updatedMember = {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: name.split(" ")[0],
        LNAME: name.split(" ")[1],
        PHONE: phone,
        ORIGIN: origin,
        CAMPAIGN: utm_campaign,
        SOURCE: utm_source,
        MEDIUM: utm_medium,
        CONTENT: utm_content,
        TERM: utm_term,
        SCK: sck,
      },
    };

    await mailchimp.lists.updateListMember(
      listId,
      subscriberHash,
      updatedMember
    );

    return subscriberHash;
  } catch (e) {
    if (e.status === 404) {
      // Membro não encontrado, então crie um novo
      return await createContact(body);
    } else {
      // Algum outro erro aconteceu
      console.error("Erro desconhecido:", e);
      throw e;
    }
  }
}

module.exports = {
  createContactOnMailchimp,
  updateContactTagsOnMailchimp,
  ensureContact,
};
