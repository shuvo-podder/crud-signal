import { HttpClient } from '@angular/common/http';
import { Injectable,inject  } from '@angular/core';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})

export class Api {
  // Base URL for the API
  baseUrl = 'http://localhost:3000'; // Adjust the URL as per your backend configuration
  http = inject(HttpClient);

  // Method to get user
  getUsers() {
    return this.http.get<User[]>(this.baseUrl + '/users');
  }
  // Method to add a new user
  addUser(user: User) {
    return this.http.post<User>(this.baseUrl + '/users', user);
  }
  // Method to update an existing user
  updateUser(user: User) {
    return this.http.put(this.baseUrl + '/users/' + user.id, user);
  }
  // Method to delete a user
  deleteUser(user: User) {
    return this.http.delete(this.baseUrl + '/users/' + user.id);
  }
}
