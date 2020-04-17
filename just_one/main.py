# Tutorial:
# https://codeburst.io/building-your-first-chat-application-using-flask-in-7-minutes-f98de4adfa5d

from flask import Flask, render_template, request
from flask_socketio import SocketIO, join_room, leave_room, send
# The Pretty Print tut (https://www.youtube.com/watch?v=RdSrkkrj3l4) imports `send` here as well



# Here's Miguel Grinberg (author: Flask-=SocketIO) on writing a React/Flask app:
# https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project



app = Flask(__name__)
app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
socketio = SocketIO(app)


@app.route('/')
def sessions():
    print('Someone just connected')
    return render_template('session.html')    


@socketio.on('disconnect')
def on_disconnect():
    print('Client disconnected!!!!')


# From Codeburst tutorial:
def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')

@socketio.on('group-message')
def handle_my_custom_event(json, methods=['GET', 'POST']):
    print('received my event: ' + str(json))
    socketio.emit('my response', json, callback=messageReceived)
    print(request)
    print('Here is the sid:')
    print(request.sid)


# TODO what naming convention for the event names? snake_case?
@socketio.on('join_room_requested')
def join_room_requested(data):
    user_name = data['user_name']
    room_name = data['room_name']
    join_room(room_name)
    socketio.send(f'{user_name} has entered the room.', room=room_name)


@socketio.on('leave_room_requested')
def leave_room_requested(data):
    user_name = data['user_name']
    room_name = data['room_name']
    leave_room(room_name)
    socketio.send(f'{user_name} has left the room.', room=room_name)


# From the Pretty Printed tut:
@socketio.on('message')
def handleMessage(msg):
    print('Message:', msg)
    send(msg, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True)


# QUESTIONS
# What is purpose of callbacks? Is it code executed client-side or server side?
# Is Broadcast always true?
# Look up emit() and send() in the docs
# The send() and emit() "context-specific" functions are different from socketio.emit() somehow? 
