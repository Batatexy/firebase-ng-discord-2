import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesService } from '../../services/movies.service';
import { ReviewsService } from '../../services/reviews.service';

@Component({
  selector: 'app-common-action-button',
  imports: [CommonModule],
  templateUrl: './common-action-button.component.html',
  styleUrl: './common-action-button.component.scss'
})
export class CommonActionButtonComponent {
  //É chamado por funções enviadas para este botão
  constructor(private getMoviesService: MoviesService, private getReviewsService: ReviewsService) { }

  @Input() className: string = "";
  @Input() actionFunction!: () => void;

}
