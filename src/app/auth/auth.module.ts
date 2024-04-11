import { NgModule } from "@angular/core";
import { AuthComponent } from "./auth.component";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations:[
        AuthComponent
    ],
    imports:[
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild([{ path: 'auth', component: AuthComponent }]),
        SharedModule
    ]
})
export class AuthModule{}