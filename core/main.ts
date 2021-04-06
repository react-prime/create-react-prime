import color from 'kleur';

import Logger from 'core/Logger';

import App from 'modules/App';


async function bootstrap() {
  const logger = new Logger();

  // Startup msg
  const packageName = color.yellow().bold(process.env.NAME!);
  const version = process.env.VERSION;

  logger.msg(`${packageName} v${version} ${color.dim('(ctrl + c to exit)')}\n`);

  // Run
  const app = new App();
  await app.start();
  await app.end();

  // Exit node process
  process.exit();
}

bootstrap();
