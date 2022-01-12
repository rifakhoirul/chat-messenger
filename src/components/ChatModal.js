import React from 'react'
import { Form, Button, Modal} from 'react-bootstrap'

export default function ModalChat({modalOpen,closeModal,handleSubmitNewChat,users,useridLogin,selectedContactIds,handleCheckBoxChange}) {
    return (
        <Modal show={modalOpen} onHide={closeModal}>
            <Modal.Header closeButton> New Chat</Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmitNewChat}>
                    {users && users.map(user => (
                        <Form.Group
                            controlId={user._id}
                            key={user._id}
                            className={`${user._id === useridLogin ? 'hiddenItem' : ''}`}>
                            <Form.Check
                                type="checkbox"
                                value={selectedContactIds.includes(user._id)}
                                label={user.username}
                                onChange={() => handleCheckBoxChange(user._id)}
                            />
                        </Form.Group>
                    ))}
                    <div className="mt-4">
                        <Button type="submit">Chat</Button>
                        <Button onClick={closeModal} variant="secondary" className="ms-2">Cancel</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
