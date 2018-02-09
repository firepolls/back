<h1 align="center">
  Firepolls
  <br>
</h1>

Firepolls is a polling application that provides fast formative actionable data to users in real time.

Users can create, join rooms and create polls anonymously. When a user creates a room they can invite other users to join with the room name. Once a room is created the owner can then create polls which are available to other users within the room. If users choose to sign up, they will have access to saved rooms which contain poll results.

Firepolls is a fullstack javascript application.

## Build Status

[![Build Status](https://travis-ci.org/firepolls/back.svg?branch=master)](https://travis-ci.org/firepolls/back/)
[![npm](https://img.shields.io/npm/l/express.svg)](https://github.com/firepolls/back/blob/master/LICENSE)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-green.svg)

## Tech / Frameworks

### Back-end:
- node.js
    - babel-core
    - babel-preset-env
    - babel-register
    - bcrypt
    - cors
    - dotenv
    - express
    - http-errors
    - jsonwebtoken
    - mongoose
    - socket.io
    - babel-eslint
    - eslint
    - eslint-config-airbnb-base
    - eslint-plugin-babel
    - eslint-plugin-import
    - faker
    - jest
    - nodemon
    - superagent

### Front-end:
- node.js
    - babel-core
    - babel-loader
    - babel-preset-env
    - babel-preset-react
    - babel-preset-stage-2
    - clean-webpack-plugin
    - css-loader
    - dotenv
    - express
    - extract-text-webpack-plugin
    - file-loader
    - html-webpack-plugin
    - material-ui
    - node-sass
    - react
    - react-dom
    - react-redux
    - react-router-dom
    - react-stars
    - redux
    - redux-devtools-extension
    - resolve-url-loader
    - sass-loader
    - serve-favicon
    - socket.io
    - socket.io-client
    - style-loader
    - superagent
    - uglifyjs-webpack-plugin
    - url-loader
    - uuid
    - validator
    - webpack
    - webpack-dev-server
    - babel-eslint
    - enzyme
    - enzyme-adapter-react-16
    - eslint
    - eslint-config-airbnb
    - eslint-plugin-babel
    - eslint-plugin-import
    - eslint-plugin-jsx-a11y
    - eslint-plugin-react
    - jest


### Hosting
  - Heroku

### Database
  - MongoDB

### Continuous Integration
  - TravisCI

## Features

### User

  - signup
  - login
  - create a room
  - join a room
  - leave a room
  - vote on polls

### User(as a room creator)
  - create polls
  - close room
  - save a room's poll results (if user has an account)

## Entity Relationship Model

<h1 align="center">
  <img src="https://i.imgur.com/RMpKJy2.png" alt="Volly" width="960"></a>
</h1>


## Tests

All tests run through the Jest testing suite on the front and back end.
To run our code you must clone both front and back repos:

Front:
https://github.com/firepolls/front

Back:
https://github.com/firepolls/back

Install all required dependencies by running npm i. Before running tests you must install [MongoDB](https://www.mongodb.com/download-center?jmp=nav#community). Once MongoDB is installed you can start your database with npm run dbon in your terminal.

How to use?

Visit our site at www.firepolls.com. You can get to creating a room and polls right away. Invite users to your room by providing them with your room name which they can input into the join form. If you choose to create an account by selecting sign up you can save rooms which contain your poll results.


## Contribute

Want to help? Contribute to our project! Fork our [repo](https://github.com/firepolls) and make a PR. Please feel free to contact us prior to beginning any work to discuss your ideas.

## Credits

[Robert Reed](https://github.com/RobertMcReed)

[Pedja Josifovic](https://github.com/pjosifovic)

[Kerry Nordstrom](https://github.com/kerrynordstrom)

[Seth Donohue](https://github.com/SethDonohue)

[Anthony Robinson](https://github.com/AMKRobinson)





## License

MIT ©  [Robert Reed](https://github.com/RobertMcReed),  [Pedja Josifovic](https://github.com/pjosifovic),  [Kerry Nordstrom](https://github.com/kerrynordstrom),  [Seth Donohue](https://github.com/SethDonohue),  & [Anthony Robinson](https://github.com/AMKRobinson)
