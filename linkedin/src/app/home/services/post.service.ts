import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Post} from "../models/Post";
import {environment} from "../../../environments/environment";

@Injectable({providedIn: "root"})
export class PostService{
  constructor(private http: HttpClient) {}

  getSelecetedPosts(params){
    return this.http.get<Post[]>( `${environment.baseUrl}/feed${params}`);
  }
}
