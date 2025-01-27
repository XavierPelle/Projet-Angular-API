import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Post } from '../models/post';
import { CommonModule } from '@angular/common';
import { PostService } from '../services/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss'
})
export class PostCreateComponent {

  createPostForm: FormGroup;

  constructor(private fb: FormBuilder, private postService: PostService, private router: Router) {
    this.createPostForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.createPostForm.valid) {
      const post: Post = {
        title: this.createPostForm.get('title')?.value,
        content: this.createPostForm.get('content')?.value
      };

      this.postService.createPost(post).subscribe({
        next: () => {
          this.router.navigate(["/posts"]);
        },
        error: () => {
          console.error('Erreur lors de la création du post');
        },
      });
    }
  }

}
