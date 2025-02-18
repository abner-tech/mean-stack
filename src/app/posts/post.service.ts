import { Injectable } from '@angular/core';
import { Post } from './post-list/post.model';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map(
            (post: {
              id: string;
              title: string;
              content: string;
              _id: string;
            }) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
              };
            }
          );
        })
      )
      .subscribe((transformedPost) => {
        this.posts = transformedPost;
        this.postUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(post: Post) {
    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((response) => {
        post.id = response.postId;
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete<{ message: string }>('http://localhost:3000/api/posts/' + postId)
      .subscribe((response) => {
        this.posts = this.posts.filter((post) => post.id !== postId);
        this.postUpdated.next([...this.posts]);
      });
  }

  getPost(id: string) {
    return this.http.get
    <{_id: string , title: string, content: string }>
    ('http://localhost:3000/api/posts/' + id)
    //return { ...this.posts.find((post) => post.id === id) };
  }

  updatePost(post:  Post) {
    this.http
      .put('http://localhost:3000/api/posts/' + post.id, post)
      .subscribe((response) => {
        const updatePost = [...this.posts];
        const oldPostIndex = updatePost.findIndex( (p) => {
          post.id === p.id;
        });
        updatePost[oldPostIndex] = post;
        this.posts = updatePost;
        this.postUpdated.next([...this.posts]);
      });
  }
}
