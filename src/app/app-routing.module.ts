import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

const appRoute: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    {
        path: 'recipes',
        loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule)
    },
    {
        path: 'shopping-list',
        loadChildren: ()=> import('./shopping-list/shopping-list.module').then(m=>m.ShoppingListModule)
    }
]

@NgModule({
    imports: [RouterModule.forRoot(appRoute, {preloadingStrategy: PreloadAllModules})],     // telling angular to preload all the module in idel time. So means fast initial load and then fast subsequent load.
    exports: [RouterModule]
})
export class AppRoutingModule { }