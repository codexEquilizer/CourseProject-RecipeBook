import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ShoppingListComponent } from "./shopping-list.component";

const ShoppingRoutes: Routes = [
    { path: '', component: ShoppingListComponent },
]

@NgModule({
    imports:[RouterModule.forChild(ShoppingRoutes)],
    exports:[RouterModule]
})
export class ShoppingListRoutingModule{}