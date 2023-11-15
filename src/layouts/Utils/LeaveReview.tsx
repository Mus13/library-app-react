import { useState } from "react";
import { StarsReview } from "./StarsReview";

export const LeaveReview: React.FC<{ submitReview:any }> = (props) => {

    const [starInput,setStarInput]= useState(0);
    const [displayInput,setDisplayInput]= useState(false);
    const [reviewDescription,setReviewDescription]= useState("");

    function starValue(value:number){
        setStarInput(value);
        setDisplayInput(true);
    }
    return(
        <div className="dropdown" style={{cursor:"pointer"}}>
            <h5 className="dropdown-toggle" id="dropDownMenuButton1" data-bs-toggle="dropdown">
                Leave a review?
            </h5>
            <ul id="submitReviewRating" className="dropdown-menu" aria-aria-labelledby="dropDownMenuButton1">
                <li><button className="dropdown-item" onClick={()=>starValue(0)}>0 Star</button></li>
                <li><button className="dropdown-item" onClick={()=>starValue(0.5)}>0.5 Star</button></li>
                <li><button className="dropdown-item" onClick={()=>starValue(1)}>1 Star</button></li>
                <li><button className="dropdown-item" onClick={()=>starValue(1.5)}>1.5 Star</button></li>
                <li><button className="dropdown-item" onClick={()=>starValue(2)}>2 Star</button></li>
                <li><button className="dropdown-item" onClick={()=>starValue(2.5)}>2.5 Star</button></li>
                <li><button className="dropdown-item" onClick={()=>starValue(3)}>3 Star</button></li>
                <li><button className="dropdown-item" onClick={()=>starValue(3.5)}>3.5 Star</button></li>
                <li><button className="dropdown-item" onClick={()=>starValue(4)}>4 Star</button></li>
                <li><button className="dropdown-item" onClick={()=>starValue(4.5)}>4.5 Star</button></li>
                <li><button className="dropdown-item" onClick={()=>starValue(5)}>5 Star</button></li>
            </ul>
            <StarsReview rating={starInput} size={32} />
            {
                displayInput &&
                <form method="POST" action="#">
                    <hr />
                    <div className="mb-3">
                        <label className="form-label">
                            Description
                        </label>
                        <textarea   className="form-control" 
                                    id="submitReviewDescription" 
                                    placeholder="Optional" 
                                    rows={3}
                                    onChange={ e => setReviewDescription(e.target.value)}>
                        </textarea>
                    </div>
                    <div>
                        <button type="button" className="btn btn-primary mt-3" onClick={() =>props.submitReview(starInput,reviewDescription)}>Submit review</button>
                    </div>
                </form>
            }
            
        </div>
    );
}