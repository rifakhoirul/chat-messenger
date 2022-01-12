import React from 'react'
import { Form, Button, InputGroup } from 'react-bootstrap'

export default function ChatPanel({ selectedConversationId, conversations, setRef, useridLogin, resendChat, deleteResendChat, handleSubmitText, setText, text }) {
    return (
        <>
            {selectedConversationId && (
                <div id="openchat" className="d-flex flex-column flex-grow-1">
                    <div className="flex-grow-1 overflow-auto">
                        <div className="d-flex flex-column align-items-start justify-content-end px-3">
                            {conversations.filter(i => { return i.room._id === selectedConversationId }).map((item, index) => {
                                let lastMessage = index === conversations.filter(i => { return i.room._id === selectedConversationId }).length - 1
                                return (
                                    <div
                                        key={item._id}
                                        ref={lastMessage ? setRef : null}
                                        className={`my-1 d-flex flex-column ${item.author._id === useridLogin ? 'align-self-end' : ''}`}
                                    >
                                        <div
                                            className={`text-muted small ${item.author._id === useridLogin ? 'align-self-end' : ''}`}
                                        >{item.author._id === useridLogin ? 'You' : item.author.username}</div>
                                        <div
                                            className={`rounded py-2 px-3 ${item.author._id === useridLogin ? '' : 'border'}`}
                                            style={{ backgroundColor: `${item.author._id === useridLogin ? '#D3EEBE' : ''}` }}
                                        >{item.message} {item.sent === false ? <span><span onClick={() => resendChat(item._id)} className="resend text-danger"><i className="bi bi-arrow-clockwise"></i></span><span> | </span><span onClick={() => deleteResendChat(item._id)} className="resend text-danger"><i className="bi bi-trash"></i></span></span> : ''}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <Form onSubmit={handleSubmitText}>
                        <Form.Group className="m-2">
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    required
                                    value={text}
                                    onChange={e => setText(e.target.value)}
                                    placeholder="Type a message"
                                    className="mb-2 mt-2 ms-2"
                                />
                                <Button
                                    type="submit"
                                    className="mb-2 mt-2 me-2"
                                    style={{ backgroundColor: "#0AAA47", borderColor: "#0AAA47" }}
                                >
                                    Send
                                </Button>
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </div>
            )}
        </>
    )
}
