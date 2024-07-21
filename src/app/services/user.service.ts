import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { config } from '../config';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }


  getAllCities(country: any) {
    const payload =
    {
      "country": country
    }

    return this.http.post('https://countriesnow.space/api/v0.1/countries/cities', payload)
  }

  getAllCountry() {
    return this.http.get('https://countriesnow.space/api/v0.1/countries/positions')
  }

  // signupUser(user: any) {
  //   return this.http.post(`${config.register}`, user)
  // }
  // signinUser(user: any) {
  //   return this.http.post(`${config.login}`, user)
  // }


}