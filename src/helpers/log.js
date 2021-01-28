const Sentry = require('@sentry/node');

Sentry.init({
  dsn: 'https://b7ad435aa7c54b27bff60d0cbd6e26b8@o512405.ingest.sentry.io/5612353',
  tracesSampleRate: 1.0,
});

module.exports = Sentry;
