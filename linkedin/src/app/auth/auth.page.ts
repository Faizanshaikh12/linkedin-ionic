import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "./services/auth.service";
import {NewUser} from "./models/newUser.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  @ViewChild('form') form: NgForm;

  submissionType: 'login' | 'join' = 'login';

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    console.log(this.submissionType)
  }

  toggleText() {
    if (this.submissionType === 'login') {
      console.log(this.submissionType);
      this.submissionType = 'join';
    } else if (this.submissionType === 'join') {
      this.submissionType = 'login';
    }
  }

  onSubmit() {
    const {email, password} = this.form.value;
    if (!email || !password) return;
    if (this.submissionType === 'login') {
      //login
      return this.authService.login(email, password).subscribe(() => {
        this.router.navigateByUrl('/home');
      });
    } else if (this.submissionType === 'join') {
      const {firstName, lastName} = this.form.value;
      if (!firstName || !lastName) return;
      //register
      const newUser: NewUser = {firstName, lastName, email, password};
      return this.authService.register(newUser).subscribe(() => {
        this.toggleText();
      });
    }
  }

}
