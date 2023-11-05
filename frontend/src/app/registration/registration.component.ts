import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registrationForm = new FormGroup({
    email: new FormControl(''),
    name: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private http: HttpClient) { } 

  onSubmit() {
    this.http.post('http://localhost:7000/api/auth/register', this.registrationForm.value)
      .subscribe((response: any) => {
        if (response.status === 200) {
          alert('User registered successfully');
        } else {
          alert('Error: ' + response.message);
        }
      }, (error: any) => {
        alert('Error: ' + error.message);
      });
  }
  
  
}
