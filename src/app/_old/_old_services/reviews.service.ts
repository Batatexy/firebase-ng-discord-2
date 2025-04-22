
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../models/review';

@Injectable({
  providedIn: 'root',
})

export class ReviewsService {
  private apiUrl = 'http://localhost:3000';
  private reviewSliceIncrease: number = 4;
  private reviewSlice: number = this.reviewSliceIncrease;

  reviews?: Array<Review>;

  constructor(private http: HttpClient) { }



  public getReviewsByMovieID(movieID?: number): Observable<Array<Review>> {
    return this.http.get<Array<Review>>(
      `${this.apiUrl}/reviews?movieID=${movieID}`
    );
  }

  public sendReview(review: Review): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/reviews`, { ...review });
  }

  seeMoreReviews() {
    this.reviewSlice += this.reviewSliceIncrease;

    if (this.reviews) {
      if (this.reviewSlice >= this.reviews?.length) {
        this.reviewSlice = this.reviews?.length;
      }
    }
  }


  public getReviewSlice(): number {
    return this.reviewSlice;
  }

  public setReviewSlice(reviewSlice: number): void {
    this.reviewSlice = reviewSlice;
  }

  public getReviewSliceIncrease(): number {
    return this.reviewSliceIncrease;
  }

  public setReviews(reviews: Array<Review>): void {
    this.reviews = reviews;
  }

  public getReviews(): Array<Review> | undefined {
    return this.reviews;
  }
}


