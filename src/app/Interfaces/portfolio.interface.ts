export interface Portfolio {
  description: string;
  id: number;
  image: {
    altText: string;
    enabled: boolean;
    heigth: number;
    id: number;
    longDescription: string;
    remote: boolean;
    title: string;
    type: null
    uploader: {
      id: number;
    };
    url: string;
    width: number;
  }[];
  location: {
    id: number;
  };
  video: [{}];
}
