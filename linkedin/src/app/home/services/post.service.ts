import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Post} from "../models/Post";
import {environment} from "../../../environments/environment";
import {take} from "rxjs/operators";

@Injectable({providedIn: "root"})
export class PostService{
  private httpOptions: { headers: HttpHeaders } = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
  };
  constructor(private http: HttpClient) {}

  getSelectedPosts(params){
    return this.http.get<Post[]>( `${environment.baseUrl}/feed${params}`);
  }

  createPost(body: string){
    return this.http.post<Post>(`${environment.baseUrl}/feed`, {body},
      this.httpOptions).pipe(take(1));
  }

  updatePost(postId: number, body: string){
    return this.http.put<Post>(`${environment.baseUrl}/feed/${postId}`, {body},
      this.httpOptions).pipe(take(1));
  }

  deletePost(postId: number){
    return this.http.delete<Post>(`${environment.baseUrl}/feed/${postId}`).pipe(take(1));
  }

}
