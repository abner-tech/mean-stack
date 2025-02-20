import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Post } from './post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';


@Component({
  selector: 'app-post-list',
  imports: [MatExpansionModule, MatButtonModule, RouterLink, MatProgressSpinnerModule, MatPaginatorModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription = new Subscription();
  isLoading = false;
  totalPosts = 50;
  pageSize = 5;
  currentPage = 1;

  pageSizeOptions = [5,10,25,50];
  


  onDelete(id: string) {
    this.isLoading = true
    this.postsService.deletePost(id)
    .subscribe(() => {
      this.postsService.getPosts(this.pageSize, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.postsService.getPosts(this.pageSize, this.currentPage);
    this.isLoading = false;
  }


  constructor(public postsService: PostService) {}
  ngOnInit() {

    this.isLoading = true;
    this.postsService.getPosts(this.pageSize, this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });


  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe;
  }
}
