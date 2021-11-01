<p align="center">
  <img src="https://github.com/JBostelaar/react-prime/blob/master/src/static/images/prime-logo.png" alt="prime-logo" width="250px" />
</p>

This package allows you to easily install and setup [react-prime](https://github.com/react-prime/react-prime), [react-prime-ssr](https://github.com/react-prime/react-prime-ssr), [react-prime-gatsby](https://github.com/react-prime/react-prime-gatsby) and [react-prime-native](https://github.com/react-prime/react-prime-native). check their repositories for more information.

# Create React Prime
## Quick start
```shell
npx create-react-prime my-app
cd my-app
npm start
```

or

```shell
npm init react-prime my-app
cd my-app
npm start
```

Note: Because of caching, you can also use `npx create-react-prime@latest my-app` or `npm init react-prime@latest my-app` to always get the latest version.

## Options

Passing options to the CLI is optional! The CLI will prompt questions for any missing required options.

<table>
  <tr>
    <th>
        Option
    </th>
    <th>
        Value
    </th>
    <th>
        Default
    </th>
    <th>
        Description
    </th>
  </tr>
  <tr>
    <td>
      -b, --boilerplate
    </td>
    <td>
      react-spa, react-ssr, react-native, gatsby
    </td>
    <td>
      -
    </td>
    <td>
      Installs one of the supported boilerplates.
    </td>
  </tr>
  
</table>

## Development

This project uses the *Object Oriented Programming* (OOP) principle together with *Decorators* to enhance the experience of creating and modifying modules.

When adding, modifying or extending modules, no major OOP knowledge is required.

When modifying the core code, however, it is important to have basic knowledge of these principles before starting.

## Modules
This CLI is built around modules. This allows developers to easily modify and even add their own installation flows to the CLI, without digging deep into the core code.

### Add New Module (Installer)

It's very simple to add a new module! Every module will by default have the clone, update package, npm install and cleanup steps.

1. Create a new folder in `modules` with a clear description of what it is for
2. Create the installer file with a descriptive name (in CamelCase) and end it with `.installer.ts`
3. Use the template below to start
4. Add the module to the `modules/App.ts` installer list

#### Module Template
```ts
import Installer from 'core/decorators/Installer';


@Installer({
  name: 'module-name',
  cloneUrl: 'https://github.com/...',
  // steps: [CustomStep],
  // questions: [CustomQuestion],
})
export default class ModuleNameInstaller {
  // beforeInstall(): void | Promise<void> {}
}
```

**Required:**
- `name: string`: The identifier of this module. This will be used for the `--boilerplate` option.
- `cloneUrl: string`: The HTTPS clone url of the repository

**Optional:**
- `steps: Array`: A list of custom installation steps for this module, executed in the order of the array. More about steps below.
- `questions: Array`: A list of custom questions that will asked during the installation, asked in the order of the array. These questions will always be asked *after* the default questions are asked. More about questions below.

#### Module Hooks
```ts
/** Executed before the installation steps */
beforeInstall(): void | Promise<void> {}
/** Executed after the installation steps */
afterInstall(): void | Promise<void> {}
```

### Installation Steps
Every installation has multiple steps that the app will execute in a given order. There are some mandatory steps that you will see in `modules/defaults/steps` that are used in every module, but you can also add steps on a module basis.

1. To start, add a `steps` folder to the module that you want to add a new installation step to
2. Give it a descriptive name (CamelCase) and end it with `.step.ts`
3. Use the template below to start
4. The `on()` method is the entry point of your code for this step. It receives all required properties from the installation configuration as its first argument.
5. Add the installation step to the module's `steps` list

```ts
@Installer({
  ...
  steps: [CustomStep]
})
```

#### Installation Step Template

```ts
import * as i from 'types';

import Step from 'core/decorators/Step';


@Step({
  name: 'step-name',
  spinner: {
    emoji: '🔨',
    message: {
      pending: () => 'Doing something...',
      success: () => 'I did something!',
    },
  },
  //after: 'clone',
})
export class CustomStep {
  async on(options: i.InstallStepArgs): Promise<void> {
    // Required

    // Entry point of this step
    // Code whatever this installation step needs to do here!
  }

  // async when(answers: Answers): Promise<boolean> {
    // Optional

    // Dynamically decide if this step needs to be executed.
    // For example: you can use one of the answers
    // to decide if this step is relevant
  // }

  // You are free to add more methods and properties
  // to the class if needed
}
```

**Required:**
- `name: string`: The identifier of this step.
- `spinner: object`: An object that represents the data for the "spinner" that will show in the commandline when this step is (being) executed.
  - `emoji: string`: A descriptive emoji of what this step is doing. Try not to use emojis already in use.
  - `message (pending/success): () => string`: A descriptive message to show the user what is happening. This can render dynamic text.

**Optional:**
- `after: string` This property is used when you want this step to be executed after another step. Use the `name` of the other step as an identifier.


### Installation Questions
This CLI tool will ask the user questions if necessary. There are a couple default questions that you will see in `modules/defaults/questions` that are asked for every module, but you can also add questions on a module basis.

1. To start, add a `questions` folder to the module that you want to add a new question to
2. Give it a descriptive name (CamelCase) and end it with `.question.ts`
3. Use the template below to start
4. To see the full list of options, see the Inquirer docs (https://www.npmjs.com/package/inquirer#objects) or inspect one of the default questions
5. Every option can be added to the class as a method if it needs dynamic data. Every method will have all previous given answers as its first argument.
6. Add the question to the module's `questions` list

```ts
@Installer({
  ...
  questions: [CustomQuestion]
})
```

#### Question Template

```ts
import { Answers } from 'Inquirer';

import Question from 'core/decorators/Question';


@Question({
  type: 'list',
  name: 'custom-question',
  message: 'How was your day?',
  choices: ['not so great', 'okay', 'great'],
  default: 'not so great',
  beforeInstall: true,
  //afterInstall: true,
  //OS: ['mac', 'windows', 'linux'],
})
export class CustomQuestion {
  async answer(answers: Answers): Promise<void> {
    // Required

    // Code whatever this question needs to do after an answer
    // is given by the user

    // The first argument is an object of all answers given
    // to previous questions
    // i.e. { 'custom-question': 'great' }
  }

  // async when(answers: Answers): Promise<boolean> {
    // Optional

    // Dynamically decide if this question needs to be asked.
    // For example: you can use one of the previous answers
    // to decide if this question is relevant
  // }

  // Any option you see above in the Decorator can be added
  // as a method if you need dynamic data.
  // See 'OpenEditor.question.ts' for an example

  // You are free to add more methods and properties
  // to the class if needed
}
```

**Required:**
Either one of these properties is required:
- `beforeInstall: true`
- `afterInstall: true`

Questions can be asked before or after the installation.

**NOTE**: Custom questions will always be asked *after* the default questions.

**Optional:**
- `OS: Array<'mac' | 'windows' | 'linux'>`: Specify on what operating system this question should be asked. If not specified, the question will be asked on all systems.

### Useful Utilities
To help you achieve whatever you want, there are some utility classes you can use.

#### cliMgr
```ts
import cliMgr from 'core/CLIMgr';

function fn() {
  // You can directly access its methods and properties
  // without creating a new instance
  const projectName = cliMgr.getProjectName();
}
```

The cliMgr is a singleton class that stores the data passed to the CLI by the user. You can get data such as the boilerplate name or the project name from this utility class. All data given as answers to questions are also saved here.

#### Util
```ts
import Util from 'core/Util';

function fn() {
  const util = new Util();
  ...
}
```

The Util class has methods that are by default not asynchronous. Currently it has:

```ts
// child_process.exec
asyncExec(): Promise<void> {}
// fs.writeFile
asyncWriteFile(): Promise<void> {}
```

See the Node.JS documentation for how to use these functions.

#### Logger
```ts
import Logger from 'core/Logger';

function fn() {
  const logger = new Logger();
  ...
}
```

Logging utility class.

```ts
// Add a simple message with CRP prefix to the console
msg(...str: any[]): void {}

// Add a message with a warning icon and CRP prefix to the console
warning(...reason: any[]): void {}

// Add a message with an error icon and CRP prefix to the console
// This will also terminate the installation process
error(...reason: any[]): void {}

// Add a white space to the console
whitespace(): void {}
```

#### Constants
See `core/constants.ts` for all constant values to use in this project.

The `ERROR_TEXT` strings use placeholder values. You can use them like so:

```ts
logger.error(ERROR_TEXT.DirectoryExists, value, /**...add more data if there are more placeholders */);
```
