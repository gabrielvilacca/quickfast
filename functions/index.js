const { onBeforeCreate } = require("./onBeforeCreate");
const { changePassword } = require("./changePassword");
const { onHotmartWebhook } = require("./onHotmartWebhook");
// const { onUserCreate } = require("./onUserCreate");
// const { initiateCheckout } = require("./initiateCheckout");
// const { facebookCapi } = require("./facebookCapi");

module.exports = {
  onHotmartWebhook,
  onBeforeCreate,
  changePassword,
  // onUserCreate,
  // initiateCheckout,
  // facebookCapi,
};
