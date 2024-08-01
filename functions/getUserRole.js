const functions = require("firebase-functions");
const admin = require("./firebaseConfig");

exports.getUserRole = functions.https.onRequest(async (req, res) => {
  const { userId, teamId } = req.body;

  if (!userId || !teamId) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const userSnapshot = await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .get();

    if (!userSnapshot.exists) {
      return res.status(404).send("User not found");
    }

    const userData = userSnapshot.data();
    const role = userData.teams[teamId];

    if (!role) {
      return res.status(404).send("Role not found for the provided team");
    }

    res.status(200).json({ role });
  } catch (error) {
    console.error("Error fetching user role", error);
    res.status(500).send("Internal Server Error");
  }
});
