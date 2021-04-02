import * as i from 'types';
import Module from 'modules/Module';


function bootstrap() {
  const cliArgs = ['react-native'];
  const module = new Module();

  let installer!: i.Installer;

  for (const Installer of module.imports) {
    installer = new Installer() as i.Installer;

    if (installer.name === cliArgs[0]) {
      installer.beforeInstall?.();
      installer.steps.execute();
      installer.afterInstall?.();
    }
  }

  process.exit();
}

bootstrap();
