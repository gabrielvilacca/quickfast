// const { onUserCreate } = require("./onUserCreate");
const { onHotmartWebhook } = require("./onHotmartWebhook");
const { onBeforeCreate } = require("./onBeforeCreate");
const { changePassword } = require("./changePassword");
const { initiateCheckout } = require("./initiateCheckout");
const { facebookCapi } = require("./facebookCapi");

module.exports = {
  changePassword,
  // onUserCreate,
  onHotmartWebhook,
  onBeforeCreate,
};
