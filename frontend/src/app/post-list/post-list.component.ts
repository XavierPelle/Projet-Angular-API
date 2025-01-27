import { Component } from '@angular/core';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent {
  postList: Post[] = [];
  userRole: string | null = null;

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
    this.postService.getPost().subscribe({
      next: data => {
        this.postList = data;
      },
      error: () => {
        console.error('Erreur lors du chargement des produits');
      },
    });
  }
  deletePost(post: Post): void {
    console.log(post.id)
    this.postService.deletePost(post.id).subscribe({
      next: () => {
        window.location.reload();
      },
      error: () => {
        console.error('Erreur lors du chargement des produits');
      },
    });
  }
}
