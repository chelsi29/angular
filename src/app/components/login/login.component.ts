import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  hide: boolean = true;
  public loginUser: FormGroup | any

  constructor(private _userService: UserService,
    private _router: Router
  ) {

  }

  ngOnInit() {
    this.createForm()
  }

  //Toggle function for visible password and hide 
  toggleButton() {
    this.hide = !this.hide
  }

  createForm() {
    this.loginUser = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/), Validators.minLength(8), Validators.maxLength(20)]),
    })
  }

  login() {
    this._userService.signinUser(this.loginUser.value).subscribe((res: any) => {
      localStorage.setItem('userDetails', JSON.stringify(res.data))
      Swal.fire({
        toast: true,
        icon: 'success',
        position: 'top-right',
        showConfirmButton: false,
        // icon: typeIcon,
        timerProgressBar: true,
        timer: 3000,
        title: 'User login successfully'
      })
      this._router.navigate(['dashboard'])
    }, (error: any) => {
      Swal.fire({
        toast: true,
        icon: 'error',
        position: 'top-right',
        showConfirmButton: false,
        // icon: typeIcon,
        timerProgressBar: true,
        timer: 3000,
        title: `${error.error.msg}`
      })
    })

  }

}