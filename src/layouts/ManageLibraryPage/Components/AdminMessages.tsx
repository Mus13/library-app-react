import { useOktaAuth } from "@okta/okta-react"
import { useEffect, useState } from "react";
import MessageModel from "../../../Models/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { AdminMessage } from "./AdminMessage";
import AdminMessageRequest from "../../../Models/AdminMessageRequest";

export const AdminMessages = () => {

    const {authState} = useOktaAuth();

    const [isLoadingMessages, setIsLoadingMessages]=useState(true);
    const [httpError, setHttpError]=useState(null);

    const [messages, setMessages]=useState<MessageModel[]>([]);
    const [messagesPerPage, setMessagesPerPage]=useState(5);

    const [currentPage, setCurrentPAge]=useState(1);
    const [totalPages, setTotalPages]=useState(0);

    const [btnSubmit, setBtnSubmit]=useState(false);

    useEffect(()=>{
        const fetchUserMEssages= async () =>{
            if (authState && authState.isAuthenticated) {
                const url=`${process.env.REACT_APP_API}/messages/search/findByClosed?closed=${false}&page=${currentPage-1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method:"GET",
                    headers:{
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        "Content-Type": "application/json"
                    }
                }
                const messagesResponse = await fetch(url,requestOptions);
                if (!messagesResponse.ok) {
                    throw new Error("Something went wrong.");
                }
                const messagesResponseJson= await messagesResponse.json();

                setMessages(messagesResponseJson._embedded.messages);
                setTotalPages(messagesResponseJson.page.totalPages);
            }
            setIsLoadingMessages(false);
        };
        fetchUserMEssages().catch((error:any)=>{
            setIsLoadingMessages(false);
            setHttpError(error.message);
        });
        window.scrollTo(0,0);
    },[authState, currentPage, btnSubmit]);

    if (isLoadingMessages) {
        return(<SpinnerLoading/>);
    }

    if (httpError) {
        return(
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    async function submitResponseToQuestion(id:number, response:string) {
        const url= `${process.env.REACT_APP_API}/messages/secure/admin/message`;
        if (authState && authState.isAuthenticated && id!==null && response!=="") {
            const adminMessageRequest:AdminMessageRequest= new AdminMessageRequest(id,response);
            const requestOptions= {
                method:"PUT",
                headers:{
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(adminMessageRequest)
            };
            const messageAdminRequestResponse = await fetch(url, requestOptions);
            if (!messageAdminRequestResponse.ok) {
                throw new Error("Something went wrong.");
            }
            setBtnSubmit(!btnSubmit);
        }
    }

    const paginate = (pageNumber:number) => {
        setCurrentPAge(pageNumber);
    }

    return(
        <div className="mt-3">
            {messages.length>0 ?
                <>
                    <h5>Pending Q/A:</h5>
                    {messages.map(message=>(
                        <AdminMessage message={message} key={message.id} submitResponseToQuestion={submitResponseToQuestion}/>
                    ))}
                </>
            :
                <h5>No pending messages.</h5>
            }
            {totalPages>1 &&
                <Pagination paginate={paginate} currentPage={currentPage} totalPages={totalPages}/>
            }
        </div>
    );
}