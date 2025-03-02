import { Routes } from '@angular/router';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

export const routes: Routes = [
    {path: '', component: PostListComponent},
    {path: 'create', component: PostCreateComponent},
    {path: 'edit/:postId', component: PostCreateComponent},
    {path: 'login', component: LoginComponent},
    {path: 'signUp', component: SignupComponent},
];
