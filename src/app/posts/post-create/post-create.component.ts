import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';


import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post-list/post.model';

FormsModule;

@Component({
  selector: 'app-post-create',
  imports: [FormsModule, MatInputModule, MatFormFieldModule, MatCardModule, MatButtonModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css',
})
export class PostCreateComponent implements OnInit{
  private mode = 'create';
  private postId!: string;
   post: any;
  constructor(public postService: PostService, public route: ActivatedRoute) {}

  onSavePost(form: NgForm) {
    if(form.invalid) {return};

    if(this.mode === 'create') {
      const post = {id: null, title: form.value.title, content: form.value.content};
      this.postService.addPost(post)
    } else {
      const post = {id: this.postId, title: form.value.title, content: form.value.content };
      this.postService.updatePost(post)
    }


    form.resetForm();
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId')!;
        this.post = this.postService.getPost(this.postId)
        .subscribe((postData) => {
          this.post = {id: postData._id, title: postData.title, content: postData.content }
        });
      } else {
        this.mode = 'create';
        this.mode = null!;
      }
    });

  }
}
