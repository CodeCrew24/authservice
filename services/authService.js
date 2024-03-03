const uuid = require('uuid');

exports.generateClientCredentials = () => {
  const clientId = uuid.v4();
  const clientSecret = uuid.v4();
  return { clientId, clientSecret };
};
