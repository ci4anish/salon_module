import {Component, OnInit} from '@angular/core';
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

  constructor(private salonInfo: SalonInfoService) {
  }

  ngOnInit() {
    this.salonInfo.getLocationReviews(3)
      .subscribe((data: Review) => {
        const tempArr = data.reviews;
        tempArr.sort(function (a, b) {
          return b.ratingOverall - a.ratingOverall;
        });
        tempArr.length = 3;
        this.arrBestComments = tempArr;
        this.starRating = data.averageOverall;
      });
  }

}
