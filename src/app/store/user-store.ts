import { signal,inject } from '@angular/core';
import { User } from '../types/user';
import { Api } from '../services/api';
import { ToastrService } from 'ngx-toastr';

export class UserStore {
  users = signal<User[]>([]);
  //Toastr notifications 
  toastr = inject(ToastrService); // Inject the Toastr service for notifications

    api = inject(Api); // Inject the Api service to interact with backend

    // Constructor to initialize the store with some default users
    constructor() {
        this.loadUsers();
    }
    //load initial users into the store
    loadUsers() {
        this.api.getUsers().subscribe((users) => {
            this.users.set(users); // Set the users signal with the fetched users
        })
    }


    //add a new user to the store
    addUser(user: User) {
        
        // user.id = this.users().length + 1 .toString(); // Assign a unique ID based on the current length of the array
        this.api.addUser(user).subscribe((result: User) => {
            console.log(result);
            this.users.update((users) => {
                user.id = result.id; // Assign the ID from the backend response
                return [...users, user];
            });
            this.toastr.success('User added successfully', 'Success'); // Show success notification
        });
        
    }

    //update an existing user in the store
    updateUser(user: User) {
        this.api.updateUser(user).subscribe((result) => {
            console.log(result);
            this.users.update((users) => {
                return users.map((u) => {
                    if (u.id === user.id){
                        return user; // Return the updated user
                    }
                    return u; // Return the unchanged user
                });
            });
            this.toastr.success('User updated successfully', 'Success'); // Show success notification
        });
    }

    //delete a user from the store
    deleteUser(user: User) {
        // when want to delete a user then show an alert to confirm the action
        if (!confirm('Are you sure you want to delete this user?')) {
            return; // If the user cancels, do nothing
        }else {
        this.api.deleteUser(user).subscribe(() => {
            this.users.update((users) => {
            return users.filter((u) => u.id !== user.id);
        });
        // Show success notification
        this.toastr.warning('User deleted successfully.', 'warning'); // Show success notification
        });
    }
    }

}