var socket = io()

/* 접속 되었을 때 실행 */
socket.on('connect', function() {
  /* 이름을 입력받고 */
  var name = prompt('반갑습니다! 닉네임을 설정해주세요!', '')

  /* 이름이 빈칸인 경우 */
  if(!name) {
    name = '익명'
  }

  /* 서버에 새로운 유저가 왔다고 알림 */
  socket.emit('newUser', name)
})
/* 서버로부터 데이터 받은 경우 */
socket.on('update', function(data) {
  var chat = document.getElementById('chat')

  var message = document.createElement('div')
  var node = document.createTextNode(`${data.name}: ${data.message}`)
  var className = ''

  // 타입에 따라 적용할 클래스를 다르게 지정
  switch(data.type) {
    case 'message':
      className = 'other'
      break

    case 'connect':
      className = 'connect'
      break

    case 'disconnect':
      className = 'disconnect'
      break
  }

  message.classList.add(className)
  message.appendChild(node)
  chat.appendChild(message)

  // 스크롤을 자동으로 맨 아래로 이동
  chat.scrollTop = chat.scrollHeight
})

/* 메시지 전송 함수 */
function send() {
  // 입력되어있는 데이터 가져오기
  var message = document.getElementById('test').value
  
  // 가져왔으니 데이터 빈칸으로 변경
  document.getElementById('test').value = ''

  // 내가 전송할 메시지 클라이언트에게 표시
  var chat = document.getElementById('chat')
  var msg = document.createElement('div')
  var node = document.createTextNode(message)
  msg.classList.add('me')
  msg.appendChild(node)
  chat.appendChild(msg)

  // 서버로 message 이벤트 전달 + 데이터와 함께
  socket.emit('message', {type: 'message', message: message})

  // 스크롤을 자동으로 맨 아래로 이동
  chat.scrollTop = chat.scrollHeight
}

document.getElementById('test').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();  // 기본 엔터 동작 방지
    send();  // 메시지 전송
  }
});


/* 서버로부터 접속 중인 사용자 목록을 받은 경우 */
socket.on('updateUsers', function(users) {
  var userDiv = document.getElementById('users');
  userDiv.innerHTML = '';  // 기존 목록 지우기

  users.forEach(function(user) {
    var userElement = document.createElement('div');
    userElement.textContent = user.name; // 사용자 이름 추가
    userDiv.appendChild(userElement);  // 목록에 추가
  });
});


