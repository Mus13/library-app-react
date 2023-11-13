import "@okta/okta-signin-widget/dist/css/okta-sign-in.min.css";
import { useEffect, useRef } from "react";
import OktaSignIn from "@okta/okta-signin-widget";
import { oktaConfig } from "../lib/oktaConfig";

const OktaSigninWidget = ({onSuccess,onError}) => {
    const WidgetRef = useRef();
    useEffect(()=>{
        if (!WidgetRef.current) {
            return false;
        }
        const widget = new OktaSignIn(oktaConfig);
        widget.showSignInToGetTokens({
            el: WidgetRef.current
        }).then(onSuccess).catch(onError);
        return () => widget.remove();
    },[onSuccess,onError]);
    
    return(
        <div className="container mt-5 mb-5">
            <div ref={WidgetRef}></div>
        </div>
    );
}; 
export default OktaSigninWidget;