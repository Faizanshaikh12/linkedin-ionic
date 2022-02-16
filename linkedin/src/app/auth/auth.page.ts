import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  @ViewChild('form') form: NgForm;

  submissionType: 'login' | 'join' = 'login';

  constructor() {
  }

  ngOnInit() {
    console.log(this.submissionType)
  }

  toggleText() {
    debugger
    if (this.submissionType === 'login') {
      console.log(this.submissionType);
      this.submissionType = 'join';
    } else if (this.submissionType === 'join') {
      this.submissionType = 'login';
    }
  }

  onSubmit() {
    debugger
    const {email, password} = this.form.value;
    if (!email || !password) return;
    if (this.submissionType === 'login') {
      console.log(email, password);
    } else if (this.submissionType === 'join') {
      const {firstName, lastName} = this.form.value;
      if (!firstName || !lastName) return;
      console.log(email, password, firstName, lastName);
    }
  }

}