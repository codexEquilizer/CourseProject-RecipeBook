import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: 'root' })
export class DataStorageService {

    constructor(private http: HttpClient, private recipesService: RecipeService, private authService: AuthService) { }

    storeRecipes() {
        const recipes: Recipe[] = this.recipesService.getRecipes();
        const recipesMod: Recipe[] = recipes.map((recipe: Recipe)=>{
            if(recipe.ingredients){
                return {...recipe}
            } else{
                return {...recipe, ingredients: []}
            }
        })
        return this.http.put<Recipe[]>('https://courseproject-recipebook-9a7ec-default-rtdb.firebaseio.com/recipes.json', recipesMod)
    }

    fetchRecipes() {
        /* return this.authService.user.
            pipe(
                take(1),
                exhaustMap(user => {    // wait for the 1st observable to complete and then runs the 2nd observable...
                    return this.http.get<Recipe[]>('https://courseproject-recipebook-9a7ec-default-rtdb.firebaseio.com/recipes.json',
                    {
                        params: new HttpParams().set('auth', user.token)
                    })
                }),
                map(recipes => {
                    return recipes.map(recipe => {
                        // setting recipes to an empty array to the DB if the recipe has no ingredients
                        return { ...recipe, ingredient: recipe.ingredients ? recipe.ingredients : [] }
                    })
                }),
                tap(recipes => {
                    localStorage.setItem('Recipes Data', JSON.stringify(recipes));
                    return this.recipesService.setRecipes(recipes);
                })
            )   */

        return this.http.get<Recipe[]>('https://courseproject-recipebook-9a7ec-default-rtdb.firebaseio.com/recipes.json').pipe(
            map(recipes => {
                return recipes.map(recipe => {
                    // setting recipes to an empty array to the DB if the recipe has no ingredients
                    return { ...recipe, ingredient: recipe.ingredients ? recipe.ingredients : [] }
                })
            }),
            tap(recipes => {
                localStorage.setItem('Recipes Data', JSON.stringify(recipes));
                return this.recipesService.setRecipes(recipes);
            }))
            
    }
}