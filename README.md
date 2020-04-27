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
