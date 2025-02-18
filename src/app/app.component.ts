import { Component } from '@angular/core';
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { Post } from './posts/post-list/post.model';

@Component({
  selector: 'app-root',
  imports: [ PostCreateComponent, HeaderComponent, PostListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mean-course';

  storedPost: Post[] = []

  onPostAdded(post: Post) {
    console.log(post)
    this.storedPost.push(post);
  }
}
