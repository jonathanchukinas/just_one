from flask import Flask, render_template, request
from flask_socketio import SocketIO, join_room, leave_room, send, emit
from pathlib import Path


# Here's Miguel Grinberg (author: Flask-=SocketIO) on writing a React/Flask app:
# https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project



# template_path = Path('__file__').parent.parent / 'ui' / 'src'
# print(template_path.absolute())
# print(template_path.resolve())

# app = Flask(__name__, template_folder=template_path)
app = Flask(__name__)
# print(app.template_folder)
app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
socketio = SocketIO(app, cors_allowed_origins='http://localhost:5000')


# @app.route('/')
# def sessions():
#     return render_template('session.html')


@socketio.on('message')
def handle_simple_message(msg):
    # print('message event:', msg)
    send(msg, broadcast=True)


@socketio.on('message_with_name')
def handle_message(json):
    # print('custom event:', json)
    json['mykey'] = '_'
    emit('message_with_name', json, broadcast=True)


@socketio.on('json')
def handle_message(json):
    # print('json event:', json)
    pass


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


if __name__ == '__main__':
    socketio.run(app, port=3000, debug=True)

# TASKS
# TODO fix my user settings word dictionary
