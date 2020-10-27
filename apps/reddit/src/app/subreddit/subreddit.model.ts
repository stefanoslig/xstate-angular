export interface SubRedditResponse {
  kind: string;
  data: {
    children: [{ data: SubRedditData }];
  };
}

export interface SubRedditData {
  id: string;
  title: string;
}
