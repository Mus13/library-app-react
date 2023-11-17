import { useOktaAuth } from "@okta/okta-react"
import { useState } from "react";
import MessageModel from "../../../Models/MessageModel";

export const PostNewMessage = () => {

    const { authState } = useOktaAuth();

    const [title, setTitle] = useState("");
    const [question, setQuestion] = useState("");
    const [displaySuccess, setDisplaySuccess] = useState(false);
    const [displayWarning, setDisplayWarning] = useState(false);

    async function submitNewQuestion() {
        const url = `http://localhost:8080/api/messages/secure/add/message`;
        if (authState?.isAuthenticated && title !== "" && question !== "") {
            const messageRequestModel: MessageModel = new MessageModel(title, question);
            const requestOptions = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(messageRequestModel)
            };
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error("Something went wrong.");
            }
            setTitle("");
            setQuestion("");
            setDisplayWarning(false);
            setDisplaySuccess(true);
        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    return (
        <div className="card mt-3">
            <div className="card-header">
                Ask question to library admin
            </div>
            <div className="card-body">
                <form method="POST">
                    {
                        displaySuccess &&
                        <div className="alert alert-success" role="alert">
                            Question added successfully
                        </div>
                    }
                    {
                        displayWarning &&
                        <div className="alert alert-danger" role="alert">
                            All fields must be filled out.
                        </div>
                    }
                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input type="text"
                            className="form-control"
                            id="exampleFormControlInput1"
                            placeholder="Title"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Question</label>
                        <textarea className="form-control"
                            id="exampleFormControlTextaria1"
                            rows={3}
                            onChange={(e) => setQuestion(e.target.value)}
                            value={question}
                        />
                    </div>
                    <div>
                        <button className="btn btn-primary mt-3" type="button" onClick={() => submitNewQuestion()}>Submit question</button>
                    </div>
                </form>
            </div>
        </div>
    )
}