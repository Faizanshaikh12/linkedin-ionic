import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {PostService} from "../../services/post.service";
import {IonInfiniteScroll, ModalController} from "@ionic/angular";
import {Post} from "../../models/Post";
import {BehaviorSubject} from "rxjs";
import {AuthService} from "../../../auth/services/auth.service";
import {take} from "rxjs/operators";
import {PostModalComponent} from "../post-modal/post-modal.component";

@Component({
  selector: 'app-show-posts',
  templateUrl: './show-posts.component.html',
  styleUrls: ['./show-posts.component.scss'],
})
export class ShowPostsComponent implements OnInit, OnChanges {
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  @Input() postBody?: string;
  queryParams: string;
  allLoadedPosts: Post[] = [];
  take = 10;
  skip = 0;

  userId$ = new BehaviorSubject<number>(null);

  constructor(
    private postService: PostService,
    private authService: AuthService,
    public modalController: ModalController
    ) {}

  ngOnInit() {
    this.getPosts(false, '');

    this.authService.userId.pipe(take(1)).subscribe((userId: number) => {
      this.userId$.next(userId);
    })
  }

  ngOnChanges(changes: SimpleChanges){
    const postBody = changes.postBody.currentValue;
    if(postBody){
      this.postService.createPost(postBody).subscribe((post: Post) => {
        this.allLoadedPosts.unshift(post);
      });
    }

  }

  getPosts(isInitialLoad: boolean, event) {
    if (this.skip === 20) {
      event.target.disabled = true;
    }
    this.queryParams = `?take=${this.take}&skip=${this.skip}`;
    this.postService.getSelectedPosts(this.queryParams).subscribe((posts: Post[]) => {
      for (let post = 0; post < posts.length; post++) {
        this.allLoadedPosts.push(posts[post]);
      }
      if (isInitialLoad) event.target.complete();
      this.skip = this.skip + 10;
    }, (error) => {
      console.log(error);
    });
  }

  loadData(event) {
    this.getPosts(true, event);
  }

  // update post
  async updatePost(postId: number){
    const modal = await this.modalController.create({
      component: PostModalComponent,
      cssClass: 'modal-custom-class2',
      componentProps: {
        postId,

      }
    })
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if (!data) return;

    const newPostBody = data.post.body;
    this.postService.updatePost(postId, newPostBody).subscribe(() => {
      const postIndex =  this.allLoadedPosts.findIndex((post: Post) => post.id === postId);
      this.allLoadedPosts[postIndex].body = newPostBody;

    })

  }

  // update post
  deletePost(postId: number){
    this.postService.deletePost(postId).subscribe(() => {
      this.allLoadedPosts = this.allLoadedPosts.filter((post) => post.id !== postId);
    });

  }

}
