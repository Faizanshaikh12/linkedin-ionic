import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {PostModalComponent} from "../post-modal/post-modal.component";

@Component({
  selector: 'app-start-post',
  templateUrl: './start-post.component.html',
  styleUrls: ['./start-post.component.scss'],
})
export class StartPostComponent implements OnInit {

  constructor(
    public modalController: ModalController
  ) { }

  ngOnInit() {}

  async presentModal(){
    const modal = await this.modalController.create({
      component: PostModalComponent,
      cssClass: 'modal-custom-class'
    })
    await modal.present()
    const {data, role} = await modal.onDidDismiss();
    console.log('role', role);
    console.log('data', data);
  }
}
