This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Manage Dependencies

### Frontend Dependencies
The npm-installable Yarn manages the frontend javascript dependencies.
To add a new package to the project, open a terminal in the project top-level directory: `yarn add [package name]`. This install it and adds it to `package.json`.

To 

## Available Scripts

In the project directory, you can run:

### `yarn start-ui`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

## api environment

Tip: `https://realpython.com/pipenv-guide/` is a great intro to pipenv
`pipenv shell` to enter virtual environment.
`pipenv install _____` to install ______.
`pipenv lock` to lock down the currently functioning build
In production, `pipenv install--ignore-pipfile` to install per the lock file.
In development, `pipenv install --dev` to install all, including those needed for dev.


# just_one


# States
- Session
  - Game
    - Round
      - Show word to CLUERS
      - CLUERS are entering clues (waiting on CLUERS to finish)
      - CLUERS have all entered clues
      - CLUERS are deciding on dups
      - CLUERS have selected dups
      - CLues are revealed to GUESSER
      - GUESSER is thinking
      - GUESSER has entered guess
      - CLUERS are deciding if guess is correct
      - CLUERS have ruled on guess
      - Resolve round.


# Technologies to get layered in
- Flask
- SocketIO
- Rooms
- XState
- React 
- store local files
- Store messages on server (with timestamps)
- Client and server sync back and forth to make sure client has all messages
- Store only unconfirmed messages on server
- client-generated UID
- server-generated player ID
- Handle disconnects
- Handle player leaving room
- Handle new players
- Players have optional names
- Hide json info cheaters could potentially use
- prod server
- autoformatting (e.g. Black for python, Prettier for JS)
- deterministic package mgt via e.g. pipenv and yarn
- fix flask dev server polling issue with e.g. eventlet or gevent. Ensure thread-safe db access.
- robots.txt
- manifect.json?
- favicon
- collect all ui files into a new dir at same level as api


# Staged Approached:
- Multi-person chat app
  - no person cap
  - disconnect button
- 2-Player "Buttons" game
  - No rooms
  - Start Game button
  - Disconnect button
  - Name input
  - predetermined number of Rounds
  - Player buttons never disappear, but become disabled.
  - Technologies:
    - server:
      - Flask, Flask-SocketIO server
      - numbers ("timestamps") and stores all messages
    - CLient:
      - React
      - XState

# Conventions
- use `event` variable name for an event you're constructing with a mind to send to a machine. Use `e` as the function argument name in e.g. guard and action functions.