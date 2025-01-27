import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  getPost(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.API_URL}/post`);
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${environment.API_URL}/post/create`, post);
  }

  deletePost(post_id?: number): Observable<Post[]> {
		return this.http.delete<Post[]>(`${environment.API_URL}/post/delete/${post_id}`);
	}
}
