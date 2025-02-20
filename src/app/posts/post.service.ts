import { Injectable } from '@angular/core';
import { Post } from './post-list/post.model';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject< {posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParamenter = `?pageSize=${postsPerPage}&page=${currentPage}`
    this.http
      .get<{ message: string; posts: any, maxPosts: number }>('http://localhost:3000/api/posts'+queryParamenter)
      .pipe(
        map((postData) => {
          return { posts:  postData.posts.map(
            (post: {
              title: string;
              content: string;
              _id: string;
              imagePath: string;
            }) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
              };
            }
          ), maxPosts: postData.maxPosts};
        })
      )
      .subscribe((transformedPost) => {
        this.posts = transformedPost.posts;
        this.postUpdated.next( {posts: [...this.posts], postCount: transformedPost.maxPosts});
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(post: Post, image: File) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image, post.title);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((response) => {

        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
     return this.http
      .delete<{ message: string }>('http://localhost:3000/api/posts/' + postId);
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string
    }>('http://localhost:3000/api/posts/' + id);
    //return { ...this.posts.find((post) => post.id === id) };
  }

  updatePost(post: Post) {
    let postData: Post | FormData;
    if (typeof(post.imagePath) === 'object') {
      postData = new FormData();
      postData.append('id', post.id!)
      postData.append('title', post.title);
      postData.append('content', post.content);
      //means image was chenged, thus its no longer a path but an object in the
      //post instance
      postData.append('image', post.imagePath!, post.title);
    } else {
      postData = {
        id: post.id,
        title: post.title,
        content: post.content,
        imagePath: post.imagePath,
      };
    }
    this.http
      .put('http://localhost:3000/api/posts/' + post.id, postData)
      .subscribe((response) => {

        this.router.navigate(['/']);
      });
  }
}
