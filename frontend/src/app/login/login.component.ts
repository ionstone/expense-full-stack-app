import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private http: HttpClient, private router: Router) { } 

  onSubmit() {
    console.log("Starting")
    this.http.post('http://localhost:7000/api/auth/login', this.loginForm.value, { observe: 'response', withCredentials: true })
      .subscribe((response: any) => {
        localStorage.setItem('userInfo', JSON.stringify(response.body.data));

        if (response.status === 200) {
          this.router.navigate(['/dashboard']);
        } else {
          alert('Error: ' + response.message);
        }
      }, (error: any) => {
        alert('Error: ' + error.message);
      });
  }
}
