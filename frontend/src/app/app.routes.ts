import { Routes } from '@angular/router';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    { path: 'posts', component: PostListComponent },
    { path: 'post/create', component: PostCreateComponent },
    { path: 'login', component: LoginComponent },
    { path: 'account', component:  AccountComponent},
    { path: 'register', component: RegisterComponent}
];
