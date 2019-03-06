!function ()
{
    init();
    let formNode = document.querySelector('.log-form');
    formNode.onsubmit = (event) => {
        let sendMes = {},
            usernameNode = document.querySelector('.username>input'),
            passwordNode = document.querySelector('.password>input'),
            autologNode = document.querySelector('#auto-log');
        sendMes[usernameNode.name] = usernameNode.value;
        sendMes[passwordNode.name] = passwordNode.value;
        sendMes[autologNode.name] = autologNode.checked ;
        ajaxSubmit(sendMes, 'post');
        event.preventDefault();
    }

    function init()
    {
        document.body.style.height = window.innerHeight + 'px';
    }

    function ajaxSubmit(mes, method)
    {
        let xmlhttp = new XMLHttpRequest();
        let url = 'http://sepveneto.top:8007/smartHome/login/';
        xmlhttp.onreadystatechange = () => {
            if( xmlhttp.readyState === 4 )
            {
                if( xmlhttp.status === 200 )
                {
                    document.write(xmlhttp.response);
                    document.location.href = "http://sepveneto.top:8007/smartHome/";
                }
            }
        };
        xmlhttp.open('POST', url, true);
        xmlhttp.send(JSON.stringify(mes));
    }
}();