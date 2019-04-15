const FWD = "1";
const REV = "2";
const STOP = "0";
let handleFWD = apiOperate.bind(this, 'FWD'),
    handleREV = apiOperate.bind(this, 'REV'),
    handleSTOP= apiOperate.bind(this, 'STOP');
  
!function init()
{
  let operateNode = document.querySelector('#operate'),
      otherNode = document.querySelector('#operate-other');
  operateNode.addEventListener('click', handleFWD);
  otherNode.addEventListener('click', handleREV);
}();

function apiOperate(action)
{
  axios.post('/smartHome/api/motor/', {
    action
  })
  .then( ({ request }) => {
    let response = JSON.parse(request.response);
    changeState(response.currentState);
  })
}

function changeState(state)
{
  let stateNode = document.querySelector('.state'),
      operateNode = document.querySelector('#operate'),
      otherNode = document.querySelector('#operate-other');
  switch(state)
  {
    case 'FWD':
      stateNode.innerHtML = '正转';
      otherNode.style.display = 'none';
      operateNode.innerHTML = '停止';
      otherNode.removeEventListener('click', handleREV);
      operateNode.removeEventListener('click', handleFWD);
      operateNode.addEventListener('click', handleSTOP);
      break;
    case 'REV':
      stateNode.innerHtML = '反转';
      otherNode.style.display = 'none';
      operateNode.innerHTML = '停止';
      otherNode.removeEventListener('click', handleREV);
      operateNode.removeEventListener('click', handleFWD);
      operateNode.addEventListener('click', handleSTOP);
      break;
    case 'STOP':
      stateNode.innerHtML = '停止';
      otherNode.style.display = 'inline-block';
      operateNode.innerHTML = '正转';
      operateNode.removeEventListener('click', handleSTOP);
      operateNode.addEventListener('click', handleFWD);
      otherNode.addEventListener('click', handleREV);
      break;
  }
}