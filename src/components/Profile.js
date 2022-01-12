import React from 'react'
import { Button } from 'react-bootstrap'


export default function Profile({usernameLogin,logOut}) {
    return (
        <div className="list-group-item d-flex justify-content-between align-items-start">
            <div className="row align-items-center mb-2">
              <div className="col-1 me-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                </svg>
              </div>
              <div className="col">
                <div className="ms-3 me-auto">
                  <div className="fw-bold lead">{usernameLogin} </div>
                  <Button variant="outline-danger" size="sm" onClick={logOut}>Logout</Button>
                </div>
              </div>
            </div>
          </div>
    )
}
