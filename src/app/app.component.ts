import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { Post } from './posts/post-list/post.model';
import { PostService } from './posts/post.service';
import { RouterModule, RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-root',
  imports: [ HeaderComponent,RouterOutlet, RouterModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [PostService]
})
export class AppComponent {
  title = 'mean-course';

  storedPost: Post[] = []

  onPostAdded(post: Post) {
    console.log(post)
    this.storedPost.push(post);
  }
}
