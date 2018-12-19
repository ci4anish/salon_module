import {Component, Input, OnInit} from '@angular/core';
import {SalonInfoService} from '../../services/salon-info.service';
import {Review} from '../../Interfaces/review.interface';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  arrBestComments = [];
  starRating;
  @Input() salonId;

  constructor(private salonInfo: SalonInfoService) {
  }

  ngOnInit() {
    this.salonInfo.getLocationReviews(this.salonId)
      .subscribe((data: Review) => {
        if (data) {
          this.arrBestComments = data.reviews;
          this.starRating = data.averageOverall;
        }
      });
  }
}
