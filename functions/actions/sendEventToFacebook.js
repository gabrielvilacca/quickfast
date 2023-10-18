const bizSdk = require("facebook-nodejs-business-sdk");
const crypto = require("crypto");

const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const ServerEvent = bizSdk.ServerEvent;
const CustomData = bizSdk.CustomData;

const pixelId = "PIXEL";
const accessToken = functions.config().facebook.token;

function hashData(data, shouldConvertToLowercase = true) {
  let inputData = shouldConvertToLowercase
    ? data.toLowerCase().trim()
    : data.trim();
  return crypto.createHash("sha256").update(inputData).digest("hex");
}

async function sendEventToFacebook(body, ip) {
  try {
    const {
      name,
      userId,
      phone,
      event_name,
      value,
      currency,
      email,
      fbp,
      fbc,
      event_id,
      action_source,
      event_source_url,
      user_agent,
    } = body;

    let userData = new UserData()
      .setFbp(fbp)
      .setFbc(fbc)
      .setClientIpAddress(ip)
      .setClientUserAgent(user_agent);

    if (event_name === "Initiate Checkout") {
      customData = new CustomData().setValue(value).setCurrency(currency);
    }

    if (email) {
      userData.setEmail(hashData(email));
    }

    if (userId) {
      userData.setExternalId(hashData(userId, false));
    }

    if (phone) {
      userData.setPhone(hashData(phone));
    }

    if (name && name.trim().split(" ").length > 1) {
      userData.setFirstName(hashData(name.split(" ")[0]));
      userData.setLastName(hashData(name.split(" ")[1]));
    } else if (name.split(" ").length == 1) {
      userData.setFirstName(hashData(name));
    }

    let customData;

    if (event_name == "InitiateCheckout") {
      customData = new CustomData().setValue(value).setCurrency(currency);
    }

    console.log(userData);

    const serverEvent = new ServerEvent()
      .setEventName(event_name)
      .setEventTime(Math.floor(Date.now() / 1000))
      .setActionSource(action_source)
      .setEventSourceUrl(event_source_url)
      .setUserData(userData)
      .setEventId(event_id); // the unique event ID

    if (event_name === "InitiateCheckout") {
      serverEvent.setCustomData(customData);
    }

    const eventRequest = new EventRequest(accessToken, pixelId).setEvents([
      serverEvent,
    ]);

    await eventRequest
      .execute()
      .then((response) => {
        console.log(response);
        return { success: true, message: response };
      })
      .catch((error) => {
        console.error("Error sending event to Facebook", error);
        return { success: false, message: error };
      });
  } catch (error) {
    return { success: false, message: error };
  }
}

module.exports = sendEventToFacebook;
