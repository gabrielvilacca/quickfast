const { onBeforeCreate } = require("./onBeforeCreate");
const { changePassword } = require("./changePassword");
const { getUserRole } = require("./getUserRole");
const { onUserCreate } = require("./onUserCreate");
const { onHotmartWebhook } = require("./onHotmartWebhook");
// const { initiateCheckout } = require("./initiateCheckout");
const { facebookCapi } = require("./facebookCapi");

module.exports = {
  onBeforeCreate,
  changePassword,
  getUserRole,
  onUserCreate,
  onHotmartWebhook,
  // initiateCheckout,
  facebookCapi,
};
