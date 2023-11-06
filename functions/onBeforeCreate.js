const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.onBeforeCreate = functions.auth.user().onCreate(async (user) => {
  if (user.providerData && user.providerData.length) {
    if (user.providerData[0].providerId.includes("google.com")) {
      try {
        const userDoc = {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          online: true,
        };

        await db.collection("users").doc(user.uid).set(userDoc);
        functions.logger.log(
          `Document for user ${user.uid} created successfully.`
        );
      } catch (error) {
        functions.logger.error("Error creating document: ", error);
      }
    }
  }
});
