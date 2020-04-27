from flask import Flask
from flask_socketio import SocketIO, emit, send, join_room, leave_room
import time

app = Flask(__name__)
app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
# TODO replace config vars like port num to a config file
socketio = SocketIO(app, cors_allowed_origins='http://localhost:3000')


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


@socketio.on('connect')
def handle_connect():
    print('Someone just connected!!')
    emit('FromAPI', {'welcome': 'greetings!!!!!!!'})


@socketio.on('message')
def handle_simple_message(msg):
    print('message event:', msg)
    send(msg, broadcast=True)


@socketio.on('message_with_name')
def handle_message(payload):
    payload['mykey'] = '_'
    emit('message_with_name', payload, broadcast=True)


@socketio.on('room_request')
def handle_room_request(payload):
    print('room requested:', payload)
    room_name = payload['room']
    join_room(room_name)
    emit('room_confirmed', payload)
    send(f'Someone has joined the `{room_name}` room.', broadcast=True)
    # TODO remove from all other rooms


@socketio.on('room_message')
def handle_room_message(payload):
    print('room_message:', payload)
    room_name = payload['room']
    emit('room_message', payload, room=room_name)


@socketio.on('leave_room')
def handle_leave_room(payload):
    print('leaving room:', payload)
    room_name = payload['room']
    leave_room(room_name)
    emit('leave_room', payload)
    player_name = payload['name']
    msg = f'{player_name} has left the `{room_name}` room.'
    send(msg, broadcast=True)


socketio.run(app, debug=True)