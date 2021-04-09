import App from 'modules/App';


async function bootstrap() {
  // Run
  const app = new App();
  await app.start();
  await app.end();

  // Exit node process
  process.exit();
}

bootstrap();
