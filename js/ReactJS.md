# Creating ReactJS
- [Create React App](https://create-react-app.dev/)
## [Checking NPM Version & clear cache](https://phoenixnap.com/kb/update-node-js-version)
```
npm -v
npm cache clean -f
npm install -g n
```

## Using NPX & running
- Creating new reactJS project and running it in development mode
```
npx create-react-app <react-js> ## --template typescript
cd <react-js>
npm start
```
- [Running reactJS project in Production](https://create-react-app.dev/docs/production-build/)
```
npm install -g serve
serve -s build ## (opt-in) --profile 
```

## Adding dependencies
```
npm install --save react-router-dom
npm install --save bootstrap
npm install --save node-sass
npm install --save flow-bin
npm install --save babel-plugin-relay

```
