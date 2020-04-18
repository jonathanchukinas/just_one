# Tutorial:
# https://codeburst.io/building-your-first-chat-application-using-flask-in-7-minutes-f98de4adfa5d

from flask import Flask, render_template, request
from flask_socketio import SocketIO, join_room, leave_room, send, emit
# The Pretty Print tut (https://www.youtube.com/watch?v=RdSrkkrj3l4) imports `send` here as well



# Here's Miguel Grinberg (author: Flask-=SocketIO) on writing a React/Flask app:
# https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project



app = Flask(__name__)
app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
socketio = SocketIO(app)


@app.route('/')
def sessions():
    return render_template('session.html')    


@socketio.on('message')
def handle_simple_message(msg):
    print('message event:', msg)
    send(msg, broadcast=True)


@socketio.on('message_with_name')
def handle_message(json):
    print('custom event:', json)
    json['mykey'] = '_'
    emit('message_with_name', json, broadcast=True)


@socketio.on('json')
def handle_message(json):
    print('json event:', json)


@socketio.on('room_request')
def handle_room_request(payload):
    room_name = payload['room_name']
    join_room(room_name)
    msg = f'Someone has joined the `{room_name}` room.'
    emit('room_confirmed', payload)
    send(msg, broadcast=True)
    # TODO remove from all other rooms

@socketio.on('room_message')
def handle_room_message(payload):
    room_name = payload['room_name']
    emit('room_message', payload, room=room_name)

@socketio.on('leave_room')
def handle_leave_room(payload):
    room_name = payload['room_name']
    leave_room(room_name)
    emit('leave_room', payload)
    player_name = payload['player_name']
    msg = f'{player_name} has left the `{room_name}` room.'
    send(msg, broadcast=True)




# @socketio.on('leave_room_requested')
# def leave_room_requested(data):
#     user_name = data['user_name']
#     room_name = data['room_name']
#     leave_room(room_name)
#     socketio.send(f'{user_name} has left the room.', room=room_name)


if __name__ == '__main__':
    socketio.run(app, debug=True)


# QUESTIONS
# What is purpose of callbacks? Is it code executed client-side or server side?
# Is Broadcast always true?
# Look up emit() and send() in the docs
# The send() and emit() "context-specific" functions are different from socketio.emit() somehow? 


# TASKS
# TODO fix my user settings word dictionary
