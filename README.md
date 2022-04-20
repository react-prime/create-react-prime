<p align="center">
  <img src="https://github.com/LabelA/prime-monorepo/blob/main/prime-logo.png?raw=true" alt="prime-logo" width="250px" />
</p>

This CLI tool allows you to easily install and setup [react-web](https://github.com/LabelA/prime-monorepo/tree/main/boilerplates/react-web) and [react-mobile](https://github.com/LabelA/prime-monorepo/tree/main/boilerplates/react-mobile). check their repositories for more information.

# Create React Prime

## Quick start

```shell
npx create-react-prime@latest
cd <project name>
npm start
```

or

```shell
npm init react-prime@latest
cd <project name>
npm start
```

## Arguments

Passing arguments to the CLI is optional! The CLI will prompt questions for any missing required arguments. The order they are passed determines what they are used for.

<table>
  <tr>
    <th>
        #
    </th>
    <th>
        Argument name
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
      1
    </td>
    <td>
      Project Name
    </td>
    <td>
      Any text (no spaces)
    </td>
    <td>
      Boilerplate name
    </td>
    <td>
      The name of the project. No spaces allowed. Follows the directory naming rules of your current OS. This name will be applied to the installation directory, the package.json and depending on the boilerplate, can be applied to other files or directories as well.
    </td>
  </tr>
</table>

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
      -
    </td>
    <td>
      -
    </td>
    <td>
      Start installation process for boilerplates
    </td>
  </tr>
  <tr>
    <td>
      -m, --modules
    </td>
    <td>
      -
    </td>
    <td>
      -
    </td>
    <td>
      Start installation process for modules
    </td>
  </tr>
  <tr>
    <td>
      -c, --components
    </td>
    <td>
      -
    </td>
    <td>
      -
    </td>
    <td>
      Start installation process for components
    </td>
  </tr>
  <tr>
    <td>
      -d, --debug
    </td>
    <td>
      -
    </td>
    <td>
      false
    </td>
    <td>
      Enable additional logging
    </td>
  </tr>
</table>

## Development

Make sure to read further before you start developing on the create-react-prime CLI tool!

### create-react-prime

The internals are located in the [lib](https://github.com/react-prime/create-react-prime/tree/master/lib) folder. This folder acts as an internal NPM package that can be referenced with `@crp` anywhere in this project. Make sure to discuss with the team beforehand if you want to add changes to the internal code.

### Modules

Modules are located in the [src](https://github.com/react-prime/create-react-prime/tree/master/src) folder. Here you can find the logic for every installation process that this CLI tool has to offer. It's not necessary to request for changes in this section of the codebase, but it's always good to discuss your plans with the team beforehand.

Make sure to familiarize yourself with the code style and folder/file structure before you start writing code!
