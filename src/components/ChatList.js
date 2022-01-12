import React from 'react'
import { ListGroup, Badge } from 'react-bootstrap'

export default function ChatList({ groups, usernameLogin, useridLogin, selectedConversationId, setSelectedConversationId, unread, setUnread }) {
    return (
        <ListGroup variant="flush">
            {groups.filter(g => { return g.participants.findIndex(i => { return i._id === useridLogin }) >= 0 })
                .map(item => (
                    <ListGroup.Item
                        key={item._id}
                        action
                        onClick={() => {
                            setSelectedConversationId(item._id)
                            if (unread === item._id) setUnread('')
                        }}
                        active={selectedConversationId === item._id}
                        className={`py-3 d-flex justify-content-between align-items-start`}
                    >
                        <div className="ms-2 me-auto">
                            {item.participants.filter(a => {
                                return a.username !== usernameLogin
                            })
                                .map(r => r.username).join(', ')}
                        </div>
                        {unread === item._id && (
                            <Badge bg="danger" pill>
                                !
                            </Badge>
                        )
                        }
                    </ListGroup.Item>
                ))}
        </ListGroup>
    )
}
