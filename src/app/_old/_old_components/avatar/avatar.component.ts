import { Component, Input } from '@angular/core';
import { Cast } from '../../models/cast';
import { MoviesService } from '../../services/movies.service';
import { Crew } from '../../models/crew';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {

  constructor(private getMoviesService: MoviesService) { }

  @Input() imageClassName: string = "";
  @Input() nameClassName: string = "";
  @Input() subNameClassName: string = "";

  @Input() actor?: Cast;
  @Input() crew?: Crew;
  @Input() image?: string;


  ngOnInit() {
    if (this.actor || this.crew) {
      if (!this.actor?.profile_path && !this.crew?.profile_path) {
        if (this.actor?.gender == 1 || this.crew?.gender == 1) {
          //Imagem genérica feminina
          this.image = "../../../assets/images/female-profile.png";
        }
        else {
          //Imagem genérica masculina
          this.image = "../../../assets/images/male-profile.png";
        }
      }
      //Imagem da pessoa
      else {
        this.image = this.getMoviesService.getImagesUrl() + (this.actor?.profile_path || this.crew?.profile_path);
      }
    }

  }


}
