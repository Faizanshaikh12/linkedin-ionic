import {Component, OnInit, ViewChild} from '@angular/core';
import {PostService} from "../../services/post.service";
import {IonInfiniteScroll} from "@ionic/angular";
import {Post} from "../../models/Post";

@Component({
  selector: 'app-show-posts',
  templateUrl: './show-posts.component.html',
  styleUrls: ['./show-posts.component.scss'],
})
export class ShowPostsComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  queryParams: string;
  allLoadedPosts: Post[] = [];
  perPage = 5;
  page = 0;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.getPosts(false, '');
  }

  getPosts(isInitialLoad: boolean, event) {
    if (this.perPage === 20) {
      event.target.disabled = true;
    }
    this.queryParams = `?page=${this.page}&perPage=${this.perPage}`;
    this.postService.getSelecetedPosts(this.queryParams).subscribe((posts: Post[]) => {
      for (let post = 0; post < posts.length; post++) {
        this.allLoadedPosts.push(posts[post]);
      }
      if (isInitialLoad) event.target.complete();
      this.perPage = this.perPage + 5;
    }, (error) => {
      console.log(error);
    });
  }

  loadData(event) {
    this.getPosts(true, event);
  }

}
