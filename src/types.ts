// 定义 Article 接口
export interface Article {
  id: number | null;
  title: string | null;
  rumorText: string | null;
  debunkText: string | null;
  publisher: string | null;
  publishTime: Date | null;
  summary: string | null;
  crawlSource: number | null; //1-本系统，2-中互，3-较真，4-果壳
  verificationLevel: number | null;  //鉴定级别，10为真，5为半真半假，0为假
  crawlUrl: string | null; //文章链接
  status:number|null;   //上架状态：1上架，0未上架
}
//定义Clue接口
  export interface Clue {
    id: number| null;
    link: string| null;
    title: string| null;
    content: string| null;
    submitTime:Date| null;
    phone:string|null;
    field:string|null;
  }
  //定义UserInfo
  export interface UserInfo {
    id:number| null,
    nick:string| null,
    phone:string| null,
    password:string| null,
    gender:string| null,
    age:number| null,
    type:number| null,  //1读者，2核查员，3管理员
  }
   //定义Question
   export interface Question {
    id:number| null,
    questionText:string| null,
    answer:number| null,
    answerSource:string| null,
    cover:string| null,
  }
   //定义Hot
   export interface Hot {
    id:number| null,
    rank:number| null,
    topic:number| null,
    link:string| null,
    timestamp:Date|null,
    label:string|null;
  }
