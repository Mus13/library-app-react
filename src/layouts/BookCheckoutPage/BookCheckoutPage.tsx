import { useEffect, useState } from "react"
import BookModel from "../../Models/BookModel"
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../Models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../Models/ReviewRequestModel";

export const BookCheckoutPage = () => {
    const [book,setBook]=useState<BookModel>();
    const [isLoadingBook,setIsLoadingBook]=useState(true);
    const [httpError,setHttpError]=useState(null);

    //Review state
    const [reviews,setReviews]=useState<ReviewModel[]>([]);
    const [totalStars,setTotalStars]=useState(0);
    const [isLoadingReview,setIsLoadingReview]=useState(true);

    const [isReviewLeft,setIsReviewLeft]=useState(false);
    const [isLoadingUserReview,setIsLoadingUserReview]=useState(true);

    const [displayError, setDisplayError] = useState(false);

    const { authState } = useOktaAuth();

    const [currentLoansCount,setCurrentLoansCount]=useState(0);
    const [isLoadingCurrentLoansCount,setIsLoadingCurrentLoansCount]=useState(true);

    const [isBookCheckedOut,setIsBookCheckedOut]=useState(false);
    const [isLoadingBookCheckedOut,setIsLoadingBookCheckedOut]=useState(true);


    const BookId = (window.location.pathname).split('/')[2];

    useEffect(()=>{
        const fetchBook = async () => {
            const baseUrl:string=`${process.env.REACT_APP_API}/books/${BookId}`;
            const response = await fetch(baseUrl);
            if (!response.ok) {
                throw new Error("Something went wrong!");
            }
            const responseJson= await response.json();
            const loadedBook:BookModel={
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img
            };

            setBook(loadedBook);
            setIsLoadingBook(false);
        };
        fetchBook().catch((error:any)=>{
            setIsLoadingBook(false);
            setHttpError(error.message);
        });
    },[isBookCheckedOut]);

    useEffect(()=>{
            const fetchBookReview= async ()=>{
                const reviewUrl:string=`${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${BookId}`;
                const responseReview= await fetch(reviewUrl);
                if (!responseReview.ok) {
                    throw new Error("Something went wrong");
                }
                const responseJsonReview= await responseReview.json();
                const responseData= responseJsonReview._embedded.reviews;
                const loadedReviews:ReviewModel[]=[];
                let weightedStartReviews:number=0;
                for(const key in responseData){
                    loadedReviews.push({
                        id:responseData[key].id,
                        userEmail:responseData[key].userEmail,
                        date:responseData[key].date,
                        reviewDescription:responseData[key].reviewDescription,
                        rating:responseData[key].rating,
                        bookId:responseData[key].bookId
                    });
                    weightedStartReviews+=responseData[key].rating;
                }
                if (loadedReviews) {
                    const round = (Math.round((weightedStartReviews/loadedReviews.length)*2)/2).toFixed(1);
                    setTotalStars(Number(round));
                }
                setReviews(loadedReviews);
                setIsLoadingReview(false);
            }

            fetchBookReview().catch((error:any)=>{
                setIsLoadingReview(false);
                setHttpError(error.message);
            })
        },[isReviewLeft]);

    useEffect(()=>{
        const fetchUserReviewBook= async () => {
                if (authState && authState.isAuthenticated) {
                const url=`${process.env.REACT_APP_API}/reviews/secure/user/book?bookId=${BookId}`;
                const requestOptions={
                    method:"GET",
                    headers:{
                        Authorization:`Bearer ${authState?.accessToken?.accessToken}` ,
                        "Content-Type":"application/json"
                    }
                };
                const userReviewLeft= await fetch(url,requestOptions);
                if (!userReviewLeft.ok) {
                    throw new Error("Something went wrong!")
                }
                const userReviewLeftJson= await userReviewLeft.json();
                setIsReviewLeft(userReviewLeftJson);
            }
            setIsLoadingUserReview(false);
        }
        
        fetchUserReviewBook().catch((error:any)=>{
            setIsLoadingUserReview(false);
            setHttpError(error.message);
        });
        
    },[authState,isReviewLeft]);

    useEffect(()=>{
        const fetchUSerCurrentLoandCount = async () =>{
            if (authState && authState.isAuthenticated) {
                const url=`${process.env.REACT_APP_API}/books/secure/currentloans/count`;
                const requestOptions={
                    method: "GET",
                    headers: {
                        Authorization:`Bearer ${authState.accessToken?.accessToken}`,
                        "Content-Type":"application/json"
                    }
                };
                const currentLoansCountResponse= await fetch(url,requestOptions);
                if (!currentLoansCountResponse.ok) {
                    throw new Error("Something went wrong!");
                }
                const currentLoansCountResponseJson=await currentLoansCountResponse.json();
                setCurrentLoansCount(currentLoansCountResponseJson);
                
            }
            setIsLoadingCurrentLoansCount(false);
        }
        
        fetchUSerCurrentLoandCount().catch((error:any)=>{
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message);
        });
    },[authState,isBookCheckedOut]);

    useEffect(()=>{
        const fetchUserCheckedOutBook = async () =>{
            if (authState && authState.isAuthenticated) {
                const url=`${process.env.REACT_APP_API}/books/secure/ischeckedout/byuser?bookId=${BookId}`;
                const requestOptions={
                    method: "GET",
                    headers: {
                        Authorization:`Bearer ${authState.accessToken?.accessToken}`,
                        "Content-Type":"application/json"
                    }
                };
                const bookCheckedOut= await fetch(url,requestOptions);
                if (!bookCheckedOut.ok) {
                    throw new Error("Something went wrong!");
                }
                const bookCheckedOutJson=await bookCheckedOut.json();
                setIsBookCheckedOut(bookCheckedOutJson);
                
            }
            setIsLoadingBookCheckedOut(false);
        }
        
        fetchUserCheckedOutBook().catch((error:any)=>{
            setIsLoadingBookCheckedOut(false);
            setHttpError(error.message);
        });
    },[authState]);

    if (isLoadingBook || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut || isLoadingUserReview) {
        return(
            <SpinnerLoading/>
        );
    }

    if (httpError) {
        return(
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    async function checkoutBook() {
        const url=`${process.env.REACT_APP_API}/books/secure/checkout?bookId=${book?.id}`;
        const requestOptions={
            method: "PUT",
            headers: {
                Authorization:`Bearer ${authState?.accessToken?.accessToken}`,
                "Content-Type":"application/json"
            }
        };
        const checkoutResponse= await fetch(url,requestOptions);
        if (!checkoutResponse.ok) {
            setDisplayError(true);
            throw new Error("Something went wrong!");
        }
        setDisplayError(false);
        setIsBookCheckedOut(true);
    }

    async function submitReview(starInput:number, reviewDescription:string) {
        let bookId=0;
        if (book?.id) {
            bookId=book.id;
        }
        const reviewRequestModel= new ReviewRequestModel(starInput,bookId,reviewDescription)
        const url=`${process.env.REACT_APP_API}/reviews/secure`;
        const requestOptions={
            method: "POST",
            headers: {
                Authorization:`Bearer ${authState?.accessToken?.accessToken}`,
                "Content-Type":"application/json"
            },
            body: JSON.stringify(reviewRequestModel)
        };
        const submitReview= await fetch(url,requestOptions);
        if (!submitReview.ok) {
            throw new Error("Something went wrong!");
        }
        setIsReviewLeft(true);
    }

    return(
        <div>
            <div className="container d-none d-lg-block">
                {
                    displayError &&
                    <div className="alert alert-danger mt-3" role="alert">
                        Please pay outstanding fees and/or return book(s).
                    </div>
                }
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-2">
                        {
                            book?.img?
                            <img src={book?.img} width="226" height="349" alt="book"/>
                            :
                            <img src={require("./../../Images/BooksImages/book-luv2code-1000.png")} width="226" height="349" alt="book"/>
                        }
                    </div>
                    <div className="col-4 col-md-4 container">
                        <div className="ml-2">
                            <h2>
                                {book?.title}
                            </h2>
                            <h5 className="text-primary">
                                {book?.author}
                            </h5>
                            <p className="lead">
                                {book?.description}
                            </p>
                            <StarsReview rating={totalStars} size={32}/>
                        </div>
                    </div>
                    <CheckoutAndReviewBox   book={book} 
                                            mobile={false} 
                                            currentLoandCount={currentLoansCount} 
                                            isAuthenticated={authState?.isAuthenticated} 
                                            isCheckedOut={isBookCheckedOut} 
                                            checkoutBook={checkoutBook}
                                            isReviewLeft={isReviewLeft}
                                            submitReview={submitReview}/>
                </div>
                <hr/>
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false}/>
            </div>
            <div className="container d-lg-none mt-5">
                {
                    displayError &&
                    <div className="alert alert-danger mt-3" role="alert">
                        Please pay outstanding fees and/or return book(s).
                    </div>
                }
                <div className="d-flex justify-content-center align-items-center">
                    {
                        book?.img?
                        <img src={book?.img} width="226" height="349" alt="book"/>
                        :
                        <img src={require("./../../Images/BooksImages/book-luv2code-1000.png")} width="226" height="349" alt="book"/>
                    }
                </div>
                <div className="mt-4">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">
                            {book?.author}
                        </h5>
                        <p className="lead">
                            {book?.description}
                        </p>
                        <StarsReview rating={totalStars} size={32}/>
                    </div>
                </div>
                <CheckoutAndReviewBox   book={book} 
                                        mobile={true} 
                                        currentLoandCount={currentLoansCount} 
                                        isAuthenticated={authState?.isAuthenticated} 
                                        isCheckedOut={isBookCheckedOut} 
                                        checkoutBook={checkoutBook}
                                        isReviewLeft={isReviewLeft}
                                        submitReview={submitReview}/>
                <hr/>
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true}/>
            </div>
        </div>
    )
}