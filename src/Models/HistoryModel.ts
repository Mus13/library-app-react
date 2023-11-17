class HistoryModel {
    id:number;
    userEmail:string;
    title:string;
    author:string;
    description:string;
    checkoutDate:string;
    returnedDate:string;
    img:string;

    constructor(id:number,
                userEmail:string,
                title:string,
                author:string,
                description:string,
                checkoutDate:string,
                returnedDate:string,
                img:string){
        this.id=id;
        this.userEmail=userEmail;
        this.title=title;
        this.author=author;
        this.description=description;
        this.checkoutDate=checkoutDate;
        this.returnedDate=returnedDate;
        this.img=img;
    }
}
export default HistoryModel;