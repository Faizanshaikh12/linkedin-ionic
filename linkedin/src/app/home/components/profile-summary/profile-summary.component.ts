import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../auth/services/auth.service';
import {switchMap, take} from 'rxjs/operators';
import {Role} from '../../../auth/models/user.model';
import {FormControl, FormGroup} from '@angular/forms';
import {BehaviorSubject, from, of, Subscription} from 'rxjs';
import {FileTypeResult, fromBuffer} from 'file-type';

type validationExt = 'png' | 'jpg';
type validationMime = 'image/png' | 'image/jpeg';

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
export class ProfileSummaryComponent implements OnInit, OnDestroy {
  form: FormGroup;
  validationExts: validationExt[] = ['png', 'jpg'];
  validationMimes: validationMime[] = ['image/png', 'image/jpeg'];

  bannerColor: BannerColor = {
    colorOne: '#a0b4b7',
    colorTwo: '#dbe7e9',
    colorThree: '#bfd3d6',
  };

  userAvatar: string;
  private userSubscription: Subscription;
  fullName$ = new BehaviorSubject<string>(null);
  fullName = '';

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      file: new FormControl(null),
    });

    this.authService.userRole.pipe(take(1)).subscribe((role: Role) => {
      this.bannerColor = this.getBannerColors(role);
    });

    this.userSubscription = this.authService.userAvatar.subscribe((imagePath: string) => {
      this.userAvatar = imagePath;
    });

    this.authService.userFullName.pipe(take(1)).subscribe((name) => {
      this.fullName = name;
      this.fullName$.next(name);
    })
  }

  private getBannerColors(role: Role): BannerColor {
    switch (role) {
      case 'admin':
        return {
          colorOne: '#daa520',
          colorTwo: '#f0e68c',
          colorThree: '#fafad2',
        };
      case 'premium':
        return {
          colorOne: '#bc8f8f',
          colorTwo: '#c09999',
          colorThree: '#ddadaf',
        };
      default :
        return this.bannerColor;
    }
  }

  onFileSelect(e: Event): any {
    const file: File = (e.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    from(file.arrayBuffer()).pipe(
      switchMap((buffer: Buffer) => from(fromBuffer(buffer)).pipe(
        switchMap((fileTypeResult: FileTypeResult) => {
          if (!fileTypeResult) {
            console.log({error: 'file format not supported'});
            return of();
          }
          const {ext, mime} = fileTypeResult;
          const isFileTypeLegit = this.validationExts.includes(ext as any);
          const isMimeTypeLegit = this.validationMimes.includes(mime as any);
          const isFileLegit = isMimeTypeLegit && isFileTypeLegit;
          if (!isFileLegit) {
            console.log({error: 'file format dost not match file extension!'});
            return of();
          }
          return this.authService.uploadUserAvatar(formData);
        })
      ))
    ).subscribe();
    this.form.reset();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}

