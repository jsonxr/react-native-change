# react-native-change

# Usage

```
Usage: react-native-rename [options] <dir>

Rename a react-native application

Options:
  -n, --name [value]     Set name of app eg. "myapp"
  -d, --display [value]  Set display name of app eg. "myapp". If none provided, uses existing
  -b, --bundle [value]   Set custom bundle identifier eg. "com.example.myapp"
  -d, --dryrun           Don't actually do anything, just output what will be done (default: false)
  -h, --help             display help for command
```

## Example

```sh
npx react-native init AwesomeProject
npx react-native-change --name NewApp --display "New App" --bundle com.example.newapp AwesomeProject
```
