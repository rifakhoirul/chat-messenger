import React, { useEffect, useRef, useState, useCallback } from "react"
import io from "socket.io-client"
import axios from 'axios'
import { Button } from 'react-bootstrap'
import Login from './Login'
import Profile from './Profile'
import ChatList from './ChatList'
import ChatModal from './ChatModal'
import ChatPanel from './ChatPanel'

const request = axios.create({
  baseURL: 'http://localhost:5000/api/',
  timeout: 10000
})

const App = () => {
  const [groups, setGroups] = useState([])
  const [useridLogin, setUseridLogin] = useState()
  const [usernameLogin, setUsernameLogin] = useState()
  const [modalOpen, setModalOpen] = useState(false)
  const [users, setUsers] = useState([]);
  const [selectedContactIds, setSelectedContactIds] = useState([])
  const [conversations, setConversations] = useState([])
  const [selectedConversationId, setSelectedConversationId] = useState()
  const [text, setText] = useState('')
  const [socket, setSocket] = useState()
  const [unread, setUnread] = useState()
  const usernameRef = useRef()

  const setRef = useCallback(node => {
    if (node) {
      node.scrollIntoView({ smooth: true })
    }
  }, [])

  //EFFECT
  useEffect(() => {
    if (localStorage.getItem('react-chat-username')) {
      setUsernameLogin(localStorage.getItem('react-chat-username'))
      setUseridLogin(localStorage.getItem('react-chat-userid'))
    }
    request.get('users').then(response => {
      importUsers(response.data)
    }).catch(err => {
      console.log(err)
    })
    request.get('chats').then(response => {
      response.data.map(i => { return i.sent = true })
      importChat(response.data)
    }).catch(err => {
      console.log(err)
    })
    request.get('groups').then(response => {
      importGroups(response.data)
    }).catch(err => {
      console.log(err)
    })
  }, []);

  useEffect(() => {
    if (socket == null) return
    socket.on('receive-message', data => {
      setConversations(old => [...old, data])
      setUnread(data.room._id)
    })
    socket.on('update-users', data => {
      setUsers(old => [...old, data])
    })
    socket.on('update-groups', data => {
      setGroups(old => [...old, data])
    })
    return () => {
      socket.off('update-users')
      socket.off('update-groups')
    }
  }, [socket])

  useEffect(() => {
    const newSocket = io('http://localhost:4000', { query: { id: useridLogin } })
    setSocket(newSocket)
    return () => newSocket.close()
  }, [useridLogin])

  //FUNCTION
  function importUsers(data) {
    setUsers(data);
  }
  function importChat(data) {
    setConversations(data);
  }
  function importGroups(data) {
    setGroups(data);
  }
  function handleSubmitLogin(e) {
    e.preventDefault()
    let user = users.find(u => { return u.username === usernameRef.current.value })
    if (user) {
      setUsernameLogin(user.username)
      setUseridLogin(user._id)
      localStorage.setItem('react-chat-username', user.username)
      localStorage.setItem('react-chat-userid', user._id)
    } else {
      request.post('users', { username: usernameRef.current.value })
        .then(response => {
          localStorage.setItem('react-chat-username', response.data.username)
          localStorage.setItem('react-chat-userid', response.data._id)
          setUsers(old => [...old, response.data])
          setUsernameLogin(response.data.username)
          setUseridLogin(response.data._id)
          const tempSocket = io('http://localhost:4000', { query: { id: useridLogin } })
          setSocket(tempSocket)
          tempSocket.emit("new-user", response.data)
          tempSocket.off("new-user")
        }).catch(err => {
          console.log(err)
        })
    }
  }
  function closeModal() {
    setModalOpen(false)
  }
  function handleSubmitNewChat(e) {
    e.preventDefault()
    let participants = selectedContactIds
    participants.push(useridLogin)
    participants.sort()
    let pCheck = participants.join('-')
    let groupLists = groups.filter(g => {
      return g.participants.findIndex(i => {
        return i._id === useridLogin
      }) >= 0
    })
    let groupLists2 = []
    groupLists.forEach(a => {
      let temp = []
      a.participants.forEach(b => {
        temp.push(b._id)
      })
      temp.sort()
      groupLists2.push(temp.join('-'))
    })
    let isThere = null
    groupLists2.forEach((a, index) => {
      if (a === pCheck) isThere = index
    })
    if (isThere == null) {
      request.post('groups', { participants: participants })
        .then(response => {
          socket.emit('new-group', response.data[0])
          setGroups(old => [...old, response.data[0]])
        }).catch(err => {
          console.log(err)
        })
    } else {
      setSelectedConversationId(groupLists[isThere]._id)
    }
    setSelectedContactIds('')
    closeModal()
  }
  function handleCheckBoxChange(id) {
    setSelectedContactIds(prevSelectedContactIds => {
      if (prevSelectedContactIds.includes(id)) {
        return prevSelectedContactIds.filter(prevId => {
          return id !== prevId
        })
      } else {
        return [...prevSelectedContactIds, id]
      }
    })
  }
  function handleSubmitText(e) {
    e.preventDefault()
    request.post(`chats`, {
      author: useridLogin,
      message: text,
      room: selectedConversationId
    }).then(response => {
      response.data[0].sent = true
      socket.emit("send-message", response)
      setConversations(old => [...old, response.data[0]])
      setText('')
    }).catch(err => {
      setConversations(old => [...old, {
        _id: Date.now(),
        author: { _id: useridLogin, username: usernameLogin },
        message: text, room: { _id: selectedConversationId },
        sent: false
      }])
      setText('')
      console.log(err)
    })
  }
  function logOut() {
    localStorage.removeItem("react-chat-username");
    localStorage.removeItem("react-chat-userid");
    setUseridLogin('')
    setUsernameLogin('')
    setSelectedConversationId()
    socket.off()
    setSocket()
  }
  function resendChat(id) {
    let resend = conversations.find(i => { return i._id === id })
    setConversations(conversations.filter(i => { return i._id !== id }))
    request.post(`chats`, {
      author: useridLogin,
      message: resend.message,
      room: resend.room._id
    }).then(response => {
      response.data[0].sent = true
      socket.emit("send-message", response)
      setConversations(old => [...old, response.data[0]])
    }).catch(err => {
      console.log(err)
    })
  }
  function deleteResendChat(id) {
    setConversations(conversations.filter(i => { return i._id !== id }))
  }

  //RENDER
  if (!usernameLogin) {
    return (
      <Login handleSubmitLogin={handleSubmitLogin} usernameRef={usernameRef} />
    )
  } else return (
    <div>
      <div className="d-flex" style={{ height: '100vh' }}>
        <div id="sidebar" style={{ width: '350px' }} className="d-flex flex-column border-end overflow-auto">
          <Profile usernameLogin={usernameLogin} logOut={logOut} />
          <Button onClick={() => setModalOpen(true)} variant="outline-secondary" className="rounded-0">
            Start new chat
          </Button>
          <ChatList groups={groups} usernameLogin={usernameLogin} useridLogin={useridLogin} selectedConversationId={selectedConversationId} setSelectedConversationId={setSelectedConversationId} unread={unread} setUnread={setUnread} />
        </div>
        <ChatModal modalOpen={modalOpen} closeModal={closeModal} handleSubmitNewChat={handleSubmitNewChat} users={users} useridLogin={useridLogin} selectedContactIds={selectedContactIds} handleCheckBoxChange={handleCheckBoxChange} />
        <ChatPanel selectedConversationId={selectedConversationId} conversations={conversations} setRef={setRef} useridLogin={useridLogin} resendChat={resendChat} deleteResendChat={deleteResendChat} handleSubmitText={handleSubmitText} setText={setText} text={text} />
      </div>
    </div>
  );
};

export default App