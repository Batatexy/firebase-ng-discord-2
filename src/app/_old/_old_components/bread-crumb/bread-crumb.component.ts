import { Component, EventEmitter, Output } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RoutesRecognized } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { CommonModule } from '@angular/common';
import { Movie } from '../../models/movie';
import { HeaderTranslationsComponent } from '../header-translations/header-translations.component';

@Component({
  selector: 'app-bread-crumb',
  imports: [RouterLink, CommonModule, HeaderTranslationsComponent],
  templateUrl: './bread-crumb.component.html',
  styleUrl: './bread-crumb.component.scss'
})
export class BreadCrumbComponent {

  pathArray: Array<string> = [];
  @Output() pathArrayEmitter = new EventEmitter<string>();

  sendTitle(pathArray: string) {
    this.pathArrayEmitter.emit(pathArray);
  }

  router: string = "";

  constructor(private getRouter: Router, private getMoviesService: MoviesService) {
    this.getRouter.events.subscribe((router) => {
      if (router instanceof NavigationEnd) {
        this.router = router.url;
        this.generateRoutes();
        this.sendTitle(this.pathArray[this.pathArray.length - 1]);
      }
    });
  }



  ngOnInit(): void {
    // this.getActivatedRoute.data.subscribe({
    //   next: (route) => {
    //     console.log("data:", route["breadCrumb"]);
    //   }
    // });
  }

  generateRoutes() {

    // router="/movie/1241982" -> router.split("/")=["/", "/movie", "movie/1241982"]
    console.log("Route:", this.router);
    this.pathArray = this.router.split("/");
    console.log("Antes:", this.pathArray);

    //Criar o Home apenas 1 vez, senão fica: ["/", "/"]
    let home = true;

    for (let i = 0; i < this.pathArray.length; i++) {
      if (this.pathArray[i] == "") {
        if (home) {
          this.pathArray[i] = "/";
          home = false;
        }
        else {
          this.pathArray.splice(i);
        }
      }
      //Adicionar "/" antes dos paths, tipo: "movie" = "/movie"
      else {
        this.pathArray[i] = "/" + this.pathArray[i];
      }

      //Depois de Home:
      if (i >= 1) {
        for (let j = 1; j < i; j++) {
          this.pathArray[i] = this.pathArray[i - 1] + this.pathArray[i];
        }
      }
    }

    //Caso a rota anterior não tenha o mesmo endereço:
    for (let i = 0; i < this.pathArray.length; i++) {
      switch (this.pathArray[i]) {
        case ("/movie"): this.pathArray[i] = "/movies"; break;
      }
    }

    console.log("Final:", this.pathArray);
  }

  public getMovie(): Movie | undefined {
    return this.getMoviesService.getMovie();
  }
}
