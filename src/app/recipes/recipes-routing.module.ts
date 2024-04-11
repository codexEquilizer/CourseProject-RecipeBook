import { RouterModule, Routes } from "@angular/router";
import { RecipesComponent } from "./recipes.component";
import { authenticationGuard } from "../auth/auth.guard";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { recipeResolver } from "./recipes-resolver.service";
import { NgModule } from "@angular/core";

const recipesRoutes: Routes = [
    {
        path: '', component: RecipesComponent, canActivate:[authenticationGuard], children: [
            { path: '', component: RecipeStartComponent },
            { path: 'new', component: RecipeEditComponent },
            { path: ':id', component: RecipeDetailComponent, resolve: [recipeResolver] },
            { path: ':id/edit', component: RecipeEditComponent, resolve: [recipeResolver] },
        ]
    }
]


@NgModule({
    imports:[RouterModule.forChild(recipesRoutes)],
    exports:[RouterModule]
})
export class RecipesRoutingModule{}