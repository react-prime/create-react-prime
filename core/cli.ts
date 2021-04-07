import commander, { Command } from 'commander';


export default function bootstrapCLI(): CLI {
  const cli = new Command() as CLI;

  cli.option(
    '-b, --boilerplate <boilerplate>',
    'Install chosen boilerplate. Options: react-spa, react-ssr, react-native',
  );

  cli.version(process.env.VERSION!);

  return cli;
}

interface CLI extends commander.Command {
  opts(): {
    boilerplate: string;
  };
}
