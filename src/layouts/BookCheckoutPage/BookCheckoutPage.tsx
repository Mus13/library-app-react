import { useEffect, useState } from "react"
import BookModel from "../../Models/BookModel"
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../Models/ReviewModel";
import { LatestReviews } from "./LatestReviews";

export const BookCheckoutPage = () => {
    const [book,setBook]=useState<BookModel>();
    const [isLoadingBook,setIsLoadingBook]=useState(true);
    const [httpError,setHttpError]=useState(null);

    //Review state
    const [reviews,setReviews]=useState<ReviewModel[]>([]);
    const [totalStars,setTotalStars]=useState(0);
    const [isLoadingReview,setIsLoadingReview]=useState(true);


    const BookId = (window.location.pathname).split('/')[2];

    useEffect(()=>{
        const fetchBook = async () => {
            const baseUrl:string=`http://localhost:8080/api/books/${BookId}`;
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
    });

    useEffect(()=>{
            const fetchBookReview= async ()=>{
                const reviewUrl:string=`http://localhost:8080/api/reviews/search/findByBookId?bookId=${BookId}`;
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
        },[]);

    if (isLoadingBook || isLoadingReview) {
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

    return(
        <div>
            <div className="container d-none d-lg-block">
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
                    <CheckoutAndReviewBox book={book} mobile={false}/>
                </div>
                <hr/>
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false}/>
            </div>
            <div className="container d-lg-none mt-5">
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
                <CheckoutAndReviewBox book={book} mobile={true}/>
                <hr/>
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true}/>
            </div>
        </div>
    )
}