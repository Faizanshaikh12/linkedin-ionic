import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.scss'],
})
export class PostModalComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  constructor(
    public modalController: ModalController
  ) {
  }

  ngOnInit() {
  }

  onDismiss() {
    this.modalController.dismiss(null, 'dismiss');
  }

  onCratePost() {
    if (!this.form.valid) return;
    const body = this.form.value['body'];
    this.modalController.dismiss({
      post: {
        body,
        createdAt: new Date()
      }
    })
  }

}
