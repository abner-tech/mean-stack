import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  NgForm,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css',
})
export class PostCreateComponent implements OnInit {
  private mode: string = 'create';
  private postId!: string;
  post: any;
  isLoading = false; 
  form!: FormGroup;
  imagePreview!: string;
  imageSelected = false;

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      const post = {
        id: null,
        title: this.form.value.title,
        content: this.form.value.content,
        imagePath: null,
      };
      this.postService.addPost(post, this.form.value.image);
    } else {
      const post = {
        id: this.postId,
        title: this.form.value.title,
        content: this.form.value.content,
        imagePath: this.form.value.image,
      };
      this.postService.updatePost(post);
      this.isLoading = false;
    }

    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.imageSelected = true;
    
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });


    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId')!;
        this.isLoading = true;
        this.post = this.postService
          .getPost(this.postId)
          .subscribe((postData) => {
            this.isLoading = false;
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
              image: postData.imagePath,
            };
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.image,
            });
          });
      } else { 
        this.mode = 'create';
        this.postId = null!;
      }
    });
  }
}
