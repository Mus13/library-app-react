import { useState } from "react";
import { HistoryPage } from "./Components/HistoryPage";
import { Loans } from "./Components/Loans";

export const ShelfPage = () => {

    const[historyClick,setHistoryClick]=useState(false);
    return(
        <div className="container">
            <div className="mt-3">
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button className="nav-link active" 
                                id="nav-loans-tab" 
                                data-bs-toggle="tab" 
                                data-bs-target="#nav-loans" 
                                type="button" role="tab" 
                                aria-controls="nav-loans" 
                                aria-selected="true"
                                onClick={()=>setHistoryClick(false)}>
                            Loans
                        </button>
                        <button className="nav-link"
                                id="nav-history-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#nav-history"
                                type="button" role="tab" 
                                aria-controls="nav-history" 
                                aria-selected="false"
                                onClick={()=>setHistoryClick(true)}>
                            Your history
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-loans" role="tab-panel" aria-labelledby="nav-loans-tab">
                        <Loans></Loans>
                    </div>
                    <div className="tab-pane" id="nav-history" role="tab-panel" aria-labelledby="nav-history-tab">
                        {historyClick ? <HistoryPage/> : <></>}
                    </div>
                </div>
            </div>
        </div>
    );
}