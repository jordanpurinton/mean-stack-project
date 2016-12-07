import {Component} from '@angular/core';
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-logout',
    template: `
    <div class="col-md-8">
        <button class="btn btn-danger" (click)="onLogout()">Log Out</button>
    </div>
`
})

export class LogoutComponent{

    constructor(private authService: AuthService, private router: Router) {}

    onLogout(){
        this.authService.logout();
        this.router.navigate(['/auth', 'signin'])
    }
}