export interface IPodcast {
  id: number;
  title: string;
  likes: {}[];
  comments: {}[];
  code: string;
  background: string;
  category: string;
  cover: string;
  date_added: Date;
  description: string;
}

export interface IComment {
  id: number;
  author: string;
  authorProfile: {
    id: number;
    profile_pic: string;
    user: number;
  };
  higher_author?: string;
  higher_comment?: number;
  podcast?: number;
  replies: {}[];
  text: string;
  was_edited: boolean;
  user: number;
  likes: {}[];
  date_added: string;
}
