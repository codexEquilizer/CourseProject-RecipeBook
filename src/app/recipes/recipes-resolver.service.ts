import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { Observable } from "rxjs";
import { inject } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";
import { RecipeService } from "./recipe.service";

export const recipeResolver: ResolveFn<Recipe[]> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> | Recipe[] | Promise<Recipe[]> => {
        const recipeService = inject(RecipeService);
        const dataStorageService = inject(DataStorageService);

        const recipes = recipeService.getRecipes();
        if (recipes.length === 0) {
            return dataStorageService.fetchRecipes();   // no need to subscribe here because resolve funtion will subscribe for me once it will find the data there.
        } else
            return recipes;
    }