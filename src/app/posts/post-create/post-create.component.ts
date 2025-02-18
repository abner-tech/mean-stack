import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';


import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Post } from '../post-list/post.model';


FormsModule;

@Component({
  selector: 'app-post-create',
  imports: [FormsModule, MatInputModule, MatFormFieldModule, MatCardModule, MatButtonModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css',
})
export class PostCreateComponent {
  inputTitle = '';
  inputContent = '';
  @Output() postCreated = new EventEmitter<Post>();

  onAddPost(form: NgForm) {
    if(form.invalid) return;
    const post = {title: form.value.title, content: form.value.content};
    this.postCreated.emit(post);
  }
}
