import { Component } from '@angular/core';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent {
  postList: Post[] = [];

  constructor(
    private postService: PostService
  ) { }

  ngOnInit(): void {
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
