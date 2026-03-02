const PORT = process.env.PORT || 3001;
const { app, initializeApp } = require('./app');

initializeApp()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Now listening on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Failed to initialize application.', error);
    process.exit(1);
  });
