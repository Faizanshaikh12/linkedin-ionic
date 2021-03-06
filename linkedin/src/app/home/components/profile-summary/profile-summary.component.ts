import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {take} from "rxjs/operators";
import {Role} from "../../../auth/models/user.model";

type BannerColor = {
  colorOne: string;
  colorTwo: string;
  colorThree: string;
};

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss'],
})
export class ProfileSummaryComponent implements OnInit {
  bannerColor: BannerColor = {
    colorOne: "#a0b4b7",
    colorTwo: "#dbe7e9",
    colorThree: "#bfd3d6",
  };

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.userRole.pipe(take(1)).subscribe((role: Role) => {
      this.bannerColor = this.getBannerColors(role);
    });
  }

  private getBannerColors(role: Role): BannerColor {
    switch (role) {
      case 'admin':
        return {
          colorOne: "#daa520",
          colorTwo: "#f0e68c",
          colorThree: "#fafad2",
        };
      case 'premium':
        return {
          colorOne: "#bc8f8f",
          colorTwo: "#c09999",
          colorThree: "#ddadaf",
        };
      default :
        return this.bannerColor;
    }
  }
}
