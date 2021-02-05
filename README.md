<p align="center">
  <img src="https://github.com/JBostelaar/react-prime/blob/master/src/static/images/prime-logo.png" alt="prime-logo" width="250px" />
</p>

This package allows you to easily install and setup [react-prime](https://github.com/react-prime/react-prime), [react-prime-ssr](https://github.com/react-prime/react-prime-ssr) and [react-prime-native](https://github.com/react-prime/react-prime-native). check their repositories for more information.

# Create React Prime
## Quick start
```
npx create-react-prime my-app
cd my-app
npm start
```

## Options

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
      -l, --lang
    </td>
    <td>
      js
    </td>
    <td>
      js
    </td>
    <td>
      What programming language you will use.
    </td>
  </tr>
  <tr>
    <td>
      -b, --boilerplate
    </td>
    <td>
      client, ssr, native
    </td>
    <td>
      -
    </td>
    <td>
      Installs one of the supported boilerplates.
    </td>
  </tr>
  <tr>
    <td>
      -d, --debug
    </td>
    <td>
      boolean
    </td>
    <td>
      false
    </td>
    <td>
      Show additional information during installation.
    </td>
  </tr>
  <tr>
    <td>
      -s, --skipStep
    </td>
    <td>
      string, string[]
    </td>
    <td>
      -
    </td>
    <td>
      A comma separated list of installation step(s) to skip. See --help to see what values you can use.
      <br /><b>WARNING:</b> can break installation!
    </td>
  </tr>
  <tr>
    <td>
      -y, --yes
    </td>
    <td>
      boolean
    </td>
    <td>
      false
    </td>
    <td>
      Skip all optional questions.
    </td>
  </tr>
</table>

## Development

This project uses the *Object Oriented Programming* (OOP), *Dependency Injection* (DI) and *Inversion of Control* (IoC) principles.

When adding, modifying or extending modules, only OOP knowledge is relevant. DI and IoC is used outside of the modules.

When modifying the core code, however, it is important to have basic knowledge of these principles before starting.

Below is a **very** brief explanation of the principles.


#### Object Oriented Programming

Object Oriented Programming (OOP) is used for structuring this project. It uses class instances for modules to store and share data between other modules.

#### Dependency Injection

Dependency Injection (DI) is a principle where modules are injected independently into the constructor of other modules. This way you do not need to keep the module's dependencies in mind when instantiating. This project uses *InversifyJS* to achieve DI.

#### Inversion of Control

Inversion of Control (IoC) is used to decouple the implementation and the shape of a module. This is useful for testing, because this means we only care about the shape of the module and not about the implementation of the module, which in turn makes mocking easier. Coupling happens in `core/ioc/container.ts` This project uses *InversifyJS* to achieve IoC.

## Modules
This CLI is built around modules. This allows developers to easily modify and even add their own installation flows to the CLI, without digging deep into the core code.

### Add installer (new module)

⚠️ TODO

### Add Custom installer

⚠️ TODO

#### Installer Hooks
```ts
/** Executed after initialization of an installer instance */
afterInit(): void

/** Executed before iterating the installation steps */
beforeInstall(): void
/** Executed after iterating the installation steps */
afterInstall(): void
```

### Installation Steps
⚠️ TODO

### Prompt
⚠️ TODO
