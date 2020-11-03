# React Starter Kit
React environemnt, which includes the following tools.

- Module Bandler -> [webpack](https://webpack.js.org/)
- Compiler of JS/TS -> [Babel](https://babeljs.io/)
- Linter of JS/TS -> [ESLint](https://eslint.org/)
- Formatter of JS/TS -> [Prettier](https:/prettier.io/)
- Linter of Css/Sass/Scss -> [Stylelint](https:/stylelint.io/)
- Unit Test Framework -> [Jest](https://jestjs.io)
- Unit Test Library -> [Enzyme](https://enzymejs.github.io/enzyme/)

NOTE: It is assumed that TypeScript is used as main language and Css or Sass (especially, Scss) are used as style sheet language in this environemnt.

## Linter and Formatter
In this environemnt, linter run before building. But if you use VSCode and want to make the formatter run when saving, please install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [stylelint-plus](https://marketplace.visualstuido.com/items?itemName=hex-ci.stylelint-plus). Then, add the following setting in *setting.json*.

```
"editor.codeActionsOnSave": {
    "source.fixAll.eslint:: true
}
```

NOTE: If Linter throws warning or error during build process, webpack stops building.

## How to start on local server
Enter the following command, and local server (3000 port) will be launched.

```
yarn start
```

## How to use environment variables
If you use environment variables, please create *xxxx.env* file including variables inside of *env* folder. In order to use these variables in JS/TS code, please do as follows.

- xxx.env
```
API_URL=https://xxx.xxx.xxx
```

- xxx.ts
```
const apiUrl = process.env.API_URL
```

Also, you can switch .env file depending on targeted environemnt. By default, *development.env*, *staging.env* and *production.env* are created in advance, which are for **development**, **staging** and **production** environment respectively. Please choose which environment you want to use as follow when you execute build process.

- For development environment
```
yarn start:dev
yarn build:dev
```

- For staging environment
```
yarn start:staging
yarn build:staging
```

- For development environment
```
yarn start:prod
yarn build:prod
```

## How to execute unit test
The file of test code must be located in /tests folder, or the file name of test code must be *.{spec, test}.{js,jsx,ts,tsx}. In order to run jest, enter the following command.

```
yarn test
```

By default, the coverage is NOT collected. If you want to collect coverage, please change the setting in jest.config.js. <br>
By the way, DOM test is assumed by default. Therefore, if you want to execute snapchat test, please install [react-test-renderer](https://www.npmjs.com/package/react-test-renderer). ALso, you can use [react-testing-library](https://github.com/testing-library) instead of enzyme.

NOTE: ENvironment values in **development.env** file are use in unit test.