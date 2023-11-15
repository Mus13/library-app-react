import { useEffect, useState } from "react";
import ReviewModel from "../../../Models/ReviewModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Review } from "../../Utils/Review";
import { Pagination } from "../../Utils/Pagination";

export const ReviewListPage = () => {

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const bookId = (window.location.pathname).split("/")[2];

    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage-1}&size=${reviewsPerPage}`;
            const responseReview = await fetch(reviewUrl);
            if (!responseReview.ok) {
                throw new Error("Something went wrong");
            }
            const responseJsonReview = await responseReview.json();
            const responseData = responseJsonReview._embedded.reviews;

            setTotalAmountOfReviews(responseJsonReview.page.totalElements);
            setTotalPages(responseJsonReview.page.totalPages);

            const loadedReviews: ReviewModel[] = [];

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    reviewDescription: responseData[key].reviewDescription,
                    rating: responseData[key].rating,
                    bookId: responseData[key].bookId
                });
            }

            setReviews(loadedReviews);
            setIsLoading(false);
        }

        fetchBookReviews().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage]);

    if (isLoading) {
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

    const indexOfLastReview: number = currentPage * reviewsPerPage;
    const indexOfFirstBook: number = indexOfLastReview - reviewsPerPage;
    let lastItem: number = reviewsPerPage * currentPage <= totalAmountOfReviews ? reviewsPerPage * currentPage : totalAmountOfReviews;
    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }

    return (
        <div className="container m-5">
            <div>
                <h3>Comments: {reviews.length}</h3>
            </div>
            <p>{indexOfFirstBook+1} to {lastItem} of {totalAmountOfReviews} reviews: </p>
            <div className="row">
                {
                    reviews.map(review=>(
                        <Review key={review.id} review={review}/>
                    ))
                }
            </div>
            {
                totalPages>1 &&
                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
            }
        </div>
    );
}