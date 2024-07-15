const { onHotmartWebhook } = require("./onHotmartWebhook");
const { onBeforeCreate } = require("./onBeforeCreate");
const { changePassword } = require("./changePassword");
const { sendInvite } = require("./sendInvite");
const { getUserRole } = require("./getUserRole");
const { onUserCreate } = require("./onUserCreate");
// const { initiateCheckout } = require("./initiateCheckout");
// const { facebookCapi } = require("./facebookCapi");

module.exports = {
  onHotmartWebhook,
  onBeforeCreate,
  changePassword,
  sendInvite,
  getUserRole,
  onUserCreate,
  // initiateCheckout,
  // facebookCapi,
};
