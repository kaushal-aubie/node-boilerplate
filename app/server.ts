import App from './app';

const main = () => {
  // create new instance of App
  const app = new App();

  // connect to db
  app.setUpDatabase();

  // start express
  app.listen();
};

main();
