    let socket = new WebSocket(
        'ws://sepveneto.top:8007/ws/smartHome/system_1/'
    );
    socket.onopen = (e) => {
        /*let message = {
            'message': 'test',
        };*/
        console.log('connect success');
        //socket.send(JSON.stringify(message));
    };
    socket.onmessage = (e) => {
        let data = JSON.parse(e.data),
            message = data['message'];
        console.log(data);
        update(data);
    };
    socket.onclose = (e) => {
        console.error('Socket closed unexpectedly');
    };

function sendMessage(order)
{
    socket.send(JSON.stringify({order}));
    console.log(`send ${order}`);
}