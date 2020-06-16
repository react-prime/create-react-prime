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
      -t, --type
    </td>
    <td>
      client, ssr, native
    </td>
    <td>
      client
    </td>
    <td>
      Installs one of the supported boilerplate types.
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
      string | string[]
    </td>
    <td>
      -
    </td>
    <td>
      A comma separated list of installation step(s) to skip. See --help to see what values you can use.
      <br /><b>WARNING:</b> can break installation!
    </td>
  </tr>
</table>
