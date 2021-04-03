import commander, { Command } from 'commander';


interface CLI extends commander.Command {
  opts(): {
    boilerplate: string;
  };
}

function bootstrapCLI(): CLI {
  const cli = new Command() as CLI;

  cli.option(
    '-b, --boilerplate <boilerplate>',
    'Install chosen boilerplate. Options: react-spa, react-ssr, react-native',
  );

  cli.version(process.env.VERSION!);
  cli.parse(process.argv);

  return cli;
}

export default bootstrapCLI;
