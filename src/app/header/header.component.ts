import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  disableSaveRecipe: boolean = false;
  private subscription: Subscription;
  isAuthenticated: boolean = false;

  constructor(
    private storageService: DataStorageService, 
    private recipeService: RecipeService,
    private authService: AuthService
    ) { }
  /*   @Output() featureSelected = new EventEmitter<string>();
  
    onSelect(feature: string) {
      this.featureSelected.emit(feature);
    } */

  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes();
    if (this.recipes?.length <= 0) {
      this.disableSaveRecipe = true;
    }

    this.subscription = this.authService.user.subscribe(
      (user:User)=>{
        this.isAuthenticated = !user ? false : true;    //Also can be written !!user
    })
  }

  onSaveData() {
    this.storageService.storeRecipes().subscribe(
      recipes => console.log(recipes)
    )
  }

  onFetchData() {
    this.storageService.fetchRecipes()
      .subscribe((recipes: Recipe[]) => {
        console.log('Fetched Recipes: ', recipes)
      });
    this.disableSaveRecipe = false;
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
