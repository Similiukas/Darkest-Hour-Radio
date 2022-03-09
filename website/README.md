# Here is some general info about the website

## Used stack:
 - React
 - Typescript
 - ESlint *(for code rules and style)*
 - Sass
 - firebase *(for db connection)*

## Some useful scripts:

To start the website locally:

    npm start

To build for production:

    npm build

## Regarding `npm audit`:

React-scripts usually has some npm audit vulnerabilities but these are minor and most likely not react-scripts problem so just run `npm audit --production` to test it out. More on there [here](https://github.com/facebook/create-react-app/issues/11174)
## Some other useful info

Using `React.FC` vs `JSX.Element` [here](https://github.com/typescript-cheatsheets/react/blob/main/README.md#function-components)