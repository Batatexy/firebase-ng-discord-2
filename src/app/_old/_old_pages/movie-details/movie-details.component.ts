import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../../models/movie';
import { MoviesService } from '../../services/movies.service';
import { WhiteCardComponent } from "../../components/white-card/white-card.component";
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { BadgeComponent } from '../../components/badge/badge.component';
import { Credits } from '../../models/credits';
import { Cast } from '../../models/cast';
import { ModalComponent } from "../../components/modal/modal.component";
import { Crew } from '../../models/crew';
import { ConfigurationsService } from '../../services/configurations.service';
import { ReviewComponent } from '../../components/review/review.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewsService } from '../../services/reviews.service';
import { Review } from '../../models/review';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { CommonActionButtonComponent } from "../../components/common-action-button/common-action-button.component";
import { GeneralService } from '../../services/general.service';
import { TranslatePipe } from '@ngx-translate/core';
import { ToastComponent } from '../../components/toast/toast.component';

@Component({
  selector: 'app-movie-details',
  imports: [
    WhiteCardComponent, CommonModule,
    AvatarComponent, BadgeComponent, ReviewComponent,
    ModalComponent, ReactiveFormsModule, FormsModule,
    CommonActionButtonComponent, TranslatePipe, ToastComponent
  ],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent {

  //Registro de Usuário
  newReview: FormGroup;
  newReviewInvalid: boolean = false;
  reviewStatus: string = "";
  showToast = false;

  reviewContentModel: string = '';
  watchedDateModel: string = '';

  sliceCast: number = 8;
  nameLength: number = 20;

  id?: number;


  credits?: Credits;

  rating: number = 1;
  ratingArray: Array<{ state: string; }> = [{ state: "half" }, { state: "null" }, { state: "null" }, { state: "null" }, { state: "null" }];

  constructor(
    private route: ActivatedRoute, private getMoviesService: MoviesService, private getReviewsService: ReviewsService,
    private getRouter: Router, private getConfigurationsService: ConfigurationsService, getUserService: UserService,
    private getGeneralService: GeneralService,
  ) {

    this.newReview = new FormGroup({
      reviewContent: new FormControl('', [Validators.minLength(3), Validators.maxLength(100), Validators.required]),
      watchedDate: new FormControl('', [])
    });

  }



  //Caso o ID do filme não exista, redireciona para a página de filmes
  ngOnInit(): void {
    //console.clear();

    this.getReviewsService.setReviewSlice(this.getReviewsService.getReviewSliceIncrease());

    this.getConfigurationsService.selectedLanguage$.subscribe({
      next: (language) => {
        console.log(language);
        this.getInformation();
      }
    });

    this.getInformation();

    //Validação dos campos de Review
    this.newReview.get('reviewContent')?.valueChanges.subscribe({
      next: (val) => {
        if (this.newReview.get('reviewContent')?.errors) {
          this.newReviewInvalid = true;
        } else {
          this.newReviewInvalid = false;
        }
      },
    });
  }

  public getInformation() {
    //ID passado pelo URL
    this.id = Number(this.route.snapshot.paramMap.get("id"));

    //Pegar da API: Detalhes do Filme
    this.getMoviesService.getMovieById(this.id, this.getConfigurationsService.getSelectedLanguage()).subscribe({
      next: (res) => {
        console.log("Movie:", res);
        this.getMoviesService.setMovie(res);
      },
      error: () => {
        this.getRouter.navigate(['/movies']);
      }
    });

    //Pegar da API: Créditos -> Elenco e Equipe de Produção
    this.getMoviesService.getCredits(this.id, this.getConfigurationsService.getSelectedLanguage()).subscribe({
      next: (res) => {
        console.log("Credits:", res);
        this.credits = res;
      },
      error: () => {
        console.error("Erro");
      }
    });

    this.getReviewsByMovieID();
  }

  public getReviewsByMovieID() {
    this.getReviewsService.getReviewsByMovieID(this.id).subscribe({
      next: (res) => {
        this.getReviewsService.setReviews(res);
      },
      error: () => {
        console.error("Error");
      }
    });

    this.calculateStars(1);
  }

  public calculateStars(newRating: number): void {
    let filledStars: number = Math.floor(newRating / 2);
    let halfStar: boolean = newRating % 2 !== 0;

    this.ratingArray.forEach((star, index) => {
      if (index < filledStars) {
        star.state = "fill";
      } else if (index === filledStars && halfStar) {
        star.state = "half";
      } else {
        star.state = "null";
      }
    });
  }

  public seeMoreReviews() {
    this.getReviewsService.seeMoreReviews();
  }

  validateDate(date: unknown) {
    if (date) {
      let watchedDate = new Date(String(date));
      let movieDate = new Date(String(this.getMoviesService.getMovie()?.release_date));

      console.log("watchedDate:", watchedDate);
      console.log("movieDate:", movieDate);

      if (watchedDate > new Date() || watchedDate < movieDate) {
        return false;
      }
    }

    return true;
  }


  public submitReview() {
    this.showToast = true;

    if (this.getMoviesService.getMovie() && !this.newReview.invalid && this.validateDate(this.newReview.value['watchedDate'])) {
      this.getReviewsService.sendReview(
        {
          id: 2,// Auto Incrementar
          userID: 1,// Ser Dinamico

          movieID: this.getMoviesService.getMovie()!.id,

          reviewContent: this.newReview.value['reviewContent'],
          watchedDate: this.newReview.value['watchedDate'],
          rating: this.rating,
          reviewDate: String(new Date),

        }).subscribe({
          complete: () => { this.reviewStatus = "success"; },
          error: () => { this.reviewStatus = "failed"; }
        });


      this.getReviewsByMovieID();
    }
  }


  ngOnDestroy() {
    this.getMoviesService.setMovie(undefined);
  }






  //Modificar
  public reviewAlreadyUploaded() {
    // if (userID == uma review já enviada com este id){
    //   return false
    // }

    return true;
  }


  public getRange(number: number): Array<number> {
    return new Array(number);
  }

  public starsReset(): void {
    this.calculateStars(this.rating);
  }

  public setRating(rating: number): void {
    this.rating = rating;
    this.calculateStars(this.rating);
  }



  public divideByTwo(number: number | undefined): number {
    return this.getGeneralService.divideByTwo(number);
  }

  public getReviewsSliced(): Array<Review> | undefined {
    return this.getReviewsService.getReviews()?.reverse().slice(0, this.getReviewsService.getReviewSlice());
  }

  public getImagesUrl(): string {
    return this.getMoviesService.getImagesUrl();
  }

  public getCastSliced(): Array<Cast> | undefined {
    return this.credits?.cast?.slice(0, this.sliceCast);
  }

  public getCast(): Array<Cast> | undefined {
    return this.credits?.cast;
    //.slice(this.slice)
  }

  public getCrew(): Array<Crew> | undefined {
    return this.credits?.crew;
  }

  public getMovie(): Movie | undefined {
    return this.getMoviesService.getMovie();
  }

  public setShowToast(showToast: boolean): void {
    this.showToast = showToast;
  }

  public haveReviewsToGet(): string {

    let reviewsLength: undefined | number = this.getReviewsService.getReviews()?.length;

    if (reviewsLength) {
      if (this.getReviewsService.getReviewSlice() >= reviewsLength) {
        return "end";
      }
    }
    else {
      return "null";
    }

    return "show";
  }
}
