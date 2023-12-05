import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import ShelfCurrentLoans from "../../../Models/ShelfCurrentLoans";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { LoansModal } from "./LoansModal";

export const Loans = () => {

    const { authState } = useOktaAuth();
    const [httpError, setHttpError] = useState(null);

    const [shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
    const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);

    const [checkout, setCheckout] = useState(false);

    useEffect(() => {
        const fetchUserCurrentLoans = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/books/secure/currentloans`;
                const requestOptions = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        "Content-Type": "application/json"
                    }
                }
                const currentLoansResponse = await fetch(url, requestOptions);
                if (!currentLoansResponse.ok) {
                    throw new Error("Something went wrong!");
                }
                const currentLoansCountResponseJson = await currentLoansResponse.json();
                setShelfCurrentLoans(currentLoansCountResponseJson);
            }
            setIsLoadingUserLoans(false);
        };
        fetchUserCurrentLoans().catch((error: any) => {
            setIsLoadingUserLoans(false);
            setHttpError(error.message);
        });
        window.scrollTo(0, 0);
    }, [authState,checkout]);

    if (isLoadingUserLoans) {
        return (
            <SpinnerLoading />
        );
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    async function returnBook(bookId:number){
        const url = `${process.env.REACT_APP_API}/books/secure/return?bookId=${bookId}`;
        const requestOptions={
            method:"PUT",
            headers:{
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                "Content-Type": "application/json"
            }
        };
        const returnResponse= await fetch(url,requestOptions);
        if(!returnResponse.ok){
            throw new Error("Something went wrong");
        }
        setCheckout(!checkout);
    }

    async function renewLoan(bookId:number){
        const url = `${process.env.REACT_APP_API}/books/secure/renewloan?bookId=${bookId}`;
        const requestOptions={
            method:"PUT",
            headers:{
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                "Content-Type": "application/json"
            }
        };
        const returnResponse= await fetch(url,requestOptions);
        if(!returnResponse.ok){
            throw new Error("Something went wrong");
        }
        setCheckout(!checkout);
    }

    return (
        <div>
            {/** Desktop */}
            <div className="d-none d-lg-block mt-2">
                {
                    shelfCurrentLoans.length > 0 ?
                        <>
                            <h5>Current loans:</h5>
                            {
                                shelfCurrentLoans.map(currentLoan => (
                                    <div key={currentLoan.book.id}>
                                        <div className="row mt-3 mb-3">
                                            <div className="col-4 col-md-4 container">
                                                {
                                                    currentLoan.book?.img ?
                                                        <img src={currentLoan.book?.img} alt="book" width="226" height="349" />
                                                        :
                                                        <img src={require("./../../../Images/BooksImages/book-luv2code-1000.png")} alt="book" width="226" height="349" />
                                                }
                                            </div>
                                            <div className="card col-3 col-md-3 container d-flex">
                                                <div className="card-body">
                                                    <div className="mt-3">
                                                        <h4>Loan options</h4>
                                                        {
                                                            currentLoan.daysLeft > 0 && <p className="text-secondary"> Due in: {currentLoan.daysLeft} days.</p>
                                                        }
                                                        {
                                                            currentLoan.daysLeft === 0 && <p className="text-success"> Due today.</p>
                                                        }
                                                        {
                                                            currentLoan.daysLeft < 0 && <p className="text-danger"> Past due by {currentLoan.daysLeft} days.</p>
                                                        }
                                                        <div className="list-group mt-3">
                                                            <button className="list-group-item list-group-item-action"
                                                                aria-current="true"
                                                                data-bs-toggle="modal"
                                                                data-bs-target={`#modal${currentLoan.book.id}`}>
                                                                Manage loan
                                                            </button>
                                                            <Link to={"search"} className="list-group-item list-group-item-action">
                                                                Search more books
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    <p className="mt-3">Help others find their adventure by reviewing your loan!</p>
                                                    <Link className="btn btn-primary" to={`/checkout/${currentLoan.book.id}`}>Leave a review</Link>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <LoansModal shelfCurrentLoan={currentLoan} mobile={false} returnBook={returnBook} renewLoan={renewLoan}/>
                                    </div>
                                ))
                            }
                        </>
                        :
                        <>
                            <h5 className="mt-3">Currently no loans.</h5>
                            <Link className="btn btn-primary" to={"search"}>Search for a new book</Link>
                        </>
                }
            </div>
            {/** Mobile */}
            <div className="container d-lg-none mt-2">
                {
                    shelfCurrentLoans.length > 0 ?
                        <>
                            <h5 className="mb-3">Current loans:</h5>
                            {
                                shelfCurrentLoans.map(currentLoan => (
                                    <div key={currentLoan.book.id}>
                                        <div className="d-flex justify-content-center align-items-center">
                                            {
                                                currentLoan.book?.img ?
                                                    <img src={currentLoan.book?.img} alt="book" width="226" height="349" />
                                                    :
                                                    <img src={require("./../../../Images/BooksImages/book-luv2code-1000.png")} alt="book" width="226" height="349" />
                                            }
                                        </div>
                                        <div className="card d-flex mt-5 mb-3">
                                            <div className="card-body container">
                                                <div className="mt-3">
                                                    <h4>Loan options</h4>
                                                    {
                                                        currentLoan.daysLeft > 0 && <p className="text-secondary"> Due in: {currentLoan.daysLeft} days.</p>
                                                    }
                                                    {
                                                        currentLoan.daysLeft === 0 && <p className="text-success"> Due today.</p>
                                                    }
                                                    {
                                                        currentLoan.daysLeft < 0 && <p className="text-danger"> Past due by {currentLoan.daysLeft} days.</p>
                                                    }
                                                    <div className="list-group mt-3">
                                                        <button className="list-group-item list-group-item-action"
                                                            aria-current="true"
                                                            data-bs-toggle="modal"
                                                            data-bs-target={`#mobilemodal${currentLoan.book.id}`}>
                                                            Manage loan
                                                        </button>
                                                        <Link to={"search"} className="list-group-item list-group-item-action">
                                                            Search more books
                                                        </Link>
                                                    </div>
                                                </div>
                                                <hr />
                                                <p className="mt-3">Help others find their adventure by reviewing your loan!</p>
                                                <Link className="btn btn-primary" to={`/checkout/${currentLoan.book.id}`}>Leave a review</Link>
                                            </div>
                                        </div>

                                        <hr />
                                        <LoansModal shelfCurrentLoan={currentLoan} mobile={true} returnBook={returnBook} renewLoan={renewLoan}/>
                                    </div>
                                ))
                            }
                        </>
                        :
                        <>
                            <h5 className="mt-3">Currently no loans.</h5>
                            <Link className="btn btn-primary" to={"search"}>Search for a new book</Link>
                        </>
                }
            </div>
        </div>
    );
}