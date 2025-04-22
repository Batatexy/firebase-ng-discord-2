import { Component, Input } from '@angular/core';
import { WhiteCardComponent } from '../white-card/white-card.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { Review } from '../../models/review';
import { ReviewsService } from '../../services/reviews.service';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { BadgeComponent } from "../badge/badge.component";
import { GeneralService } from '../../services/general.service';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-review',
  imports: [WhiteCardComponent, AvatarComponent, BadgeComponent, DatePipe, TranslatePipe],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {
  @Input() review?: Review;
  user?: User;

  constructor(
    private getUserService: UserService, private getGeneralService: GeneralService
  ) { };

  ngOnInit() {
    if (this.review) {
      this.getUserService.getUser$(this.review.userID).subscribe({
        next: (res) => {
          // ??????????
          // this.user = res;
          this.user = res[0];
        },
        error: () => {

        }
      });
    }
  }

  public divideByTwo(number: number | undefined): number {
    return this.getGeneralService.divideByTwo(number);
  }
}
