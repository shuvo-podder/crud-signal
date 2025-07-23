import { Component } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { FormBuilder, FormGroup,Validators, ReactiveFormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { UserStore } from './store/user-store';
import { User } from './types/user';
// import { Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  fromBuilder = inject(FormBuilder);
  userForm! : FormGroup;
  userStore: UserStore;
  selectedUser!: User | null;
  isSubmitted = false;
  constructor() {
    this.userForm = this.fromBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required]
    });

    this.userStore = new UserStore();
  }

  // Method to submit the form
  save() {
    this.isSubmitted = true; // Set the submitted flag to true
    this.userForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
    if(this.userForm.invalid) {
      console.log("Form is invalid");
      return; // If the form is invalid, do not proceed
    }

    let forValues = this.userForm.value;
    console.log(forValues);
    if(this.selectedUser){
      //update user
      forValues.id = this.selectedUser.id;
      this.userStore.updateUser(forValues);
    }else{
    this.userStore.addUser(forValues);
    this.isSubmitted = false; // Reset the submitted flag after successful submission
    }
    this.clearForm();
  }
  // Method to reset the form
  clearForm() {
    this.userForm.reset();
    this.selectedUser = null;
  }


  //edit user
  editUser(user: User){
    this.userForm.patchValue(user);
    this.selectedUser = user;
  }

  //delete user
  deleteUser(user: User) {
    this.userStore.deleteUser(user);
    if (this.selectedUser && this.selectedUser.id === user.id) {
      this.clearForm(); // Clear the form if the deleted user was selected
    }
  }
}
