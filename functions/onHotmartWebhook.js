const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function calculateExpirationDate(planName, creationDate) {
  const createdDate = new Date(creationDate);
  let expirationDate = new Date(creationDate); // inicializado com a data de criação

  if (planName.includes("Mensal")) {
    expirationDate.setMonth(createdDate.getMonth() + 1);
  } else if (planName.includes("Semestral")) {
    expirationDate.setMonth(createdDate.getMonth() + 6);
  } else if (planName.includes("Anual")) {
    expirationDate.setFullYear(createdDate.getFullYear() + 1);
  } else {
    expirationDate.setMonth(createdDate.getMonth() + 1);
  }

  return expirationDate;
}

app.post("/", async (req, res) => {
  const webhook = req.body;

  // Add webhook to webhooks collection
  await admin.firestore().collection("webhooks").add(webhook);

  if (Object.keys(webhook).length === 0) {
    return res.status(400).send("O objeto de webhook não deve estar vazio.");
  }

  try {
    const db = admin.firestore();
    const auth = admin.auth();

    if (webhook.event === "PURCHASE_APPROVED") {
      let userRecord;
      //Consultando a coleção "users" pelo e-mail para obter o ID
      try {
        userRecord = await auth.getUserByEmail(webhook.data.buyer.email);
      } catch (error) {
        console.log("Usuário não encontrado, criando novo usuário.");
      }

      // Verificar se encontrou o usuário
      if (!userRecord) {
        const password = generatePassword();

        userRecord = await auth.createUser({
          email: webhook.data.buyer.email,
          emailVerified: true,
          displayName: webhook.data.buyer.name,
          password,
          disabled: false,
        });

        await db.collection("users").doc(userRecord.uid).set({
          email: webhook.data.buyer.email,
          name: webhook.data.buyer.name,
          phone: webhook.data.buyer.checkout_phone,
          origin: "https://pay.hotmart.com",
        });

        // Calculando a data de renovação do plano
        const creationDate = webhook.creation_date;

        const renewalDate = calculateExpirationDate(
          webhook.data.subscription.plan.name,
          creationDate
        );

        // Definindo o objeto de assinatura
        const subscription = {
          status: "ACTIVE",
          plan: webhook.data.subscription.plan.name,
          price: webhook.data.purchase.price.value,
          purchaseDate: new Date(webhook.creation_date),
          renewalDate,
          statusDate: new Date(webhook.creation_date),
          ownerId: userRecord.uid,
          ownerEmail: webhook.data.buyer.email,
        };

        await db
          .collection("subscriptions")
          .doc(userRecord.uid)
          .set(subscription, { merge: true });

        // Enviar e-mail com os dados de acesso
        const transporter = nodemailer.createTransport({
          host: "smtp.hostinger.com",
          port: 465,
          secure: true,
          auth: {
            user: "equipe@testesvariados.shop",
            pass: "Teste123!",
          },
        });

        const mailOptions = {
          from: "Fulano <noreply@testesvariados.shop>", // TODO: Alterar nome e e-mail
          to: "rrrpieroni@gmail.com",
          subject: "Acesse o Template App agora mesmo!", // TODO: Alterar o nome do app
          html: `
          <div>
            <div style="text-align: center;">
              <h2>Olá, ${webhook.data.buyer.name}, seja bem-vindo ao Template App!</h2>
            </div>
            <div style="text-align: left;">
              <p>
                Acesse imediatamente nossa plataforma, clicando no botão e informando os dados de acesso:
              </p>
              <p>E-mail: <b>${webhook.data.buyer.email}</b></p>
              <p>Senha: <b>${password}</b></p>
              <a
                href="https://app.seuapp.com"
                style="font-weight:bold;border-radius:6px;width:100%;text-align:center;display: inline-block; padding: 16px 0; color: white; background-color: #007bff; text-decoration: none;"
                >Quero Acessar Agora</a
              >
            </div>
          </div>`, // TODO: Alterar dados no template de e-mail
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).send("Usuário criado com sucesso.");
      }

      // Pegando o ID do usuário
      const userId = userRecord.uid;

      // Calculando a data de renovação do plano
      const creationDate = webhook.creation_date;

      const renewalDate = calculateExpirationDate(
        webhook.data.subscription.plan.name,
        creationDate
      );

      // Definindo o objeto de assinatura
      const subscription = {
        status: "ACTIVE",
        plan: webhook.data.subscription.plan.name,
        price: webhook.data.purchase.price.value,
        purchaseDate: new Date(webhook.creation_date),
        renewalDate,
        statusDate: new Date(webhook.creation_date),
        ownerId: userId,
        ownerEmail: webhook.data.buyer.email,
      };

      await db
        .collection("subscriptions")
        .doc(userId)
        .set(subscription, { merge: true });
    } else if (webhook.event === "PURCHASE_CHARGEBACK") {
      //Consultando a coleção "users" pelo e-mail para obter o ID
      const userSnapshot = await db
        .collection("users")
        .where("email", "==", webhook.data.buyer.email)
        .limit(1)
        .get();

      // Verificar se encontrou o usuário
      if (userSnapshot.empty) {
        return res.status(404).send("Usuário não encontrado.");
      }

      // Pegando o ID do usuário
      const userId = userSnapshot.docs[0].id;

      // Definindo o objeto de assinatura
      const subscription = {
        status: "chargeback",
        statusDate: new Date(webhook.creation_date),
      };

      await db
        .collection("subscriptions")
        .doc(userId)
        .set(subscription, { merge: true });
    } else if (webhook.event === "PURCHASE_CANCELED") {
      //Consultando a coleção "users" pelo e-mail para obter o ID
      const userSnapshot = await db
        .collection("users")
        .where("email", "==", webhook.data.buyer.email)
        .limit(1)
        .get();

      // Verificar se encontrou o usuário
      if (userSnapshot.empty) {
        return res.status(404).send("Usuário não encontrado.");
      }

      // Pegando o ID do usuário
      const userId = userSnapshot.docs[0].id;

      // Definindo o objeto de assinatura
      const subscription = {
        status: "DECLINED",
        statusDate: new Date(webhook.creation_date),
      };

      await db
        .collection("subscriptions")
        .doc(userId)
        .set(subscription, { merge: true });
    } else if (webhook.event === "SWITCH_PLAN") {
      //Consultando a coleção "users" pelo e-mail para obter o ID
      const userSnapshot = await db
        .collection("users")
        .where("email", "==", webhook.data.buyer.email)
        .limit(1)
        .get();

      // Verificar se encontrou o usuário
      if (userSnapshot.empty) {
        return res.status(404).send("Usuário não encontrado.");
      }

      // Pegando o ID do usuário
      const userId = userSnapshot.docs[0].id;

      const newPlan = webhook.data.plans.find((plan) => plan.current).name;
      const oldPlan = webhook.data.plans.find((plan) => !plan.current).name;

      // Definindo o objeto de assinatura
      const subscription = {
        status: webhook.data.subscription.status,
        statusDate: new Date(webhook.creation_date),
        switch_plan_date: new Date(webhook.data.switch_plan_date),
        plan: newPlan,
        oldPlan: oldPlan,
      };

      await db
        .collection("subscriptions")
        .doc(userId)
        .set(subscription, { merge: true });
    } else if (webhook.event === "SUBSCRIPTION_CANCELLATION") {
      //Consultando a coleção "users" pelo e-mail para obter o ID
      const userSnapshot = await db
        .collection("users")
        .where("email", "==", webhook.data.buyer.email)
        .limit(1)
        .get();

      // Verificar se encontrou o usuário
      if (userSnapshot.empty) {
        return res.status(404).send("Usuário não encontrado.");
      }

      // Pegando o ID do usuário
      const userId = userSnapshot.docs[0].id;

      // Definindo o objeto de assinatura
      const subscription = {
        status: "CANCELED",
        statusDate: new Date(webhook.creation_date),
      };

      await db
        .collection("subscriptions")
        .doc(userId)
        .set(subscription, { merge: true });
    } else if (webhook.event === "PURCHASE_DELAYED") {
      //Consultando a coleção "users" pelo e-mail para obter o ID
      const userSnapshot = await db
        .collection("users")
        .where("email", "==", webhook.data.buyer.email)
        .limit(1)
        .get();

      // Verificar se encontrou o usuário
      if (userSnapshot.empty) {
        return res.status(404).send("Usuário não encontrado.");
      }

      // Pegando o ID do usuário
      const userId = userSnapshot.docs[0].id;

      // Definindo o objeto de assinatura
      const subscription = {
        status: "DELAYED",
        statusDate: new Date(webhook.creation_date),
      };

      await db
        .collection("subscriptions")
        .doc(userId)
        .set(subscription, { merge: true });
    }

    return res.status(201).send("Webhook processado com sucesso!");
  } catch (error) {
    console.log(`Erro ao processar o webhook com o ID: ${webhook.id} `, error);
    return res.status(500).send("Erro interno ao processar o webhook.");
  }
});

exports.onHotmartWebhook = functions.https.onRequest(app);
