import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, CommonModule, MatAutocompleteModule, MatIconModule, RouterModule, MatCardModule, ReactiveFormsModule, FormsModule, MatSelectModule, MatRadioModule, MatButtonModule, MatDatepickerModule, MatStepperModule, MatTooltipModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  hide: boolean = true;
  chide: boolean = true
  matchPassword: boolean = true
  registerBtn: boolean = false
  maxDate = new Date
  cityList: any[] = [];
  countries: any[] = [];
  filteredCountries: Observable<any> | any;
  filteredCities: Observable<any> | any;
  public registerUser: FormGroup | any


  constructor(private _userservices: UserService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.createForm();
    this.getAllCountry();

  }


  // CreatForm

  createForm() {
    this.registerUser = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern('^[a-zA-Z]*$')]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern('^[a-zA-Z]*$')]),
      middlename: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern('^[a-zA-Z]*$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(15), Validators.pattern('^[a-zA-Z0-9_]{4,15}$')]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/), Validators.minLength(8), Validators.maxLength(20)]),
      cpassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
      phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]+$')]),
      dob: new FormControl('', [Validators.required, this.minimumAgeValidator(18)]),
      gender: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      pincode: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('^[0-9]+$')]),
      status: new FormControl('', [Validators.required])
    })
  }



  //Toggle function for visible password and hide 
  toggleButton() {
    this.hide = !this.hide
  }

  //Toggle function for visible confirm password and hide 
  toggleButton1() {
    this.chide = !this.chide
  }

  // This function is used for filterr the country
  private _filterCountries(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter(country => country.name.toLowerCase().includes(filterValue));
  }

  private _filter(value: string): string[] {
    const filter = value.toLowerCase();
    return this.cityList.filter(city => city.toLowerCase().includes(filter));
  }

  // Custom validator for minimum age
  minimumAgeValidator(minAge: number) {
    return (control: any) => {
      if (!control.value) {
        return null;
      }
      const dob = new Date(control.value);
      const today = new Date();
      const diff = today.getFullYear() - dob.getFullYear();
      if (diff < minAge) {
        return { minimumAge: true };
      }
      return null;
    };
  }



  regsiter() {

    // If form is invalid, stop here
    if (this.registerUser.invalid) {
      Swal.fire({
        toast: true,
        icon: 'error',
        position: 'top-right',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 3000,
        title: 'Please fill all property'
      })
      return;
    } else {
      if (this.registerUser.value.password === this.registerUser.value.cpassword) {
        this.registerBtn = true
        this._userservices.signupUser(this.registerUser.value).subscribe((res: any) => {
          this.registerBtn = false
          Swal.fire({
            toast: true,
            icon: 'success',
            position: 'top-right',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3000,
            title: `${res.msg}`
          })
          this._router.navigate(['otp/verify'], { queryParams: { email: this.registerUser.value.email } });
        }, (error: any) => {
          this.registerBtn = false
          Swal.fire({
            toast: true,
            icon: 'error',
            position: 'top-right',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3000,
            title: `${error.error.msg ? error.error.msg : 'Something went wrong'}`
          })

        })
      } else {
        Swal.fire({
          toast: true,
          icon: 'error',
          position: 'top-right',
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 3000,
          title: 'Password not match'
        })
      }
    }
  }

  getAllCountry() {
    this._userservices.getAllCountry().subscribe((res: any) => {
      this.countries = res.data
      this.filteredCountries = this.registerUser.get('state').valueChanges.pipe(
        startWith(''),
        map((value: any) => this._filterCountries(value))
      );
    }, (error: any) => {
    })
  }

  getCity(event: any) {
    this._userservices.getAllCities(event.target.value).subscribe((res: any) => {
      this.cityList = res.data
      this.filteredCities = this.registerUser.get('city').valueChanges.pipe(startWith(''), map((value: any) => this._filter(value)));
    }, (error: any) => {
    })
  }

}