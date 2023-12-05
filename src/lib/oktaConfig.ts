export const oktaConfig = {
    clientId:"0oad8t2vmcM2N1xAc5d7",
    issuer:"https://dev-05003094.okta.com/oauth2/default",
    redirectUri:"https://localhost:3000/login/callback",
    scopes:["openid","profile","email"],
    pkce:true,
    disableHttpsCheck:true
}