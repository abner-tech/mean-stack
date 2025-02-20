export type Post = { // Define the Post interface!
  id: string | null;
  title: string;
  content: string;
  imagePath: File | string | null;
}