import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})



export class DashboardComponent implements OnInit {
  userInfo: any;
  totalIncome: number = 0;
  totalExpenses: number = 0;
  transactionForm = new FormGroup({
    date: new FormControl(''),
    userId: new FormControl(''),
    type: new FormControl(''),
    category: new FormControl(''),
    amount: new FormControl(''),
    description: new FormControl(''),
  });

  transactions: any[] = [];
  editingTransactionId: string = "";

  constructor(private http: HttpClient, private router: Router) { } 

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.reloadTransaction();
  }
  editTransaction(transactionId: string) {
    console.log("transactionId",transactionId)
    const transaction = this.transactions.find(t => t.id === transactionId);
    console.log("transaction",transaction)
    if (transaction) {
      this.transactionForm.setValue({
        date: transaction.date,
        userId: this.userInfo.id,
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        description: transaction.description,
      });

      this.editingTransactionId = transactionId;
    }
  }

  onSubmit() {
    this.transactionForm.patchValue({userId: this.userInfo.id})

    if (this.editingTransactionId) {
      this.http.patch(`http://localhost:7000/api/transaction/${this.editingTransactionId}`, this.transactionForm.value, { withCredentials: true }).subscribe(response => {
        this.editingTransactionId = ""; 
        this.transactionForm.reset(); 
        this.reloadTransaction(); 
      });
    } else {
      this.http.post('http://localhost:7000/api/transaction', this.transactionForm.value, { withCredentials: true }).subscribe(response => {
        this.transactionForm.reset(); 
        this.reloadTransaction(); 
      });
    }
  }

  reloadTransaction() {
    const userId = this.userInfo.id;
    this.http.get<any[]>(`http://localhost:7000/api/users/${userId}/transactions`, { withCredentials: true }).subscribe(transactions => {
      this.transactions = transactions; 
      this.totalIncome = 0;
      this.totalExpenses = 0;
      console.log("reloadTransaction")
      console.log(this.transactions)

      this.transactions.forEach(transaction => {
        if (transaction.type === 'Income') {
          this.totalIncome += transaction.amount;
        } else {
          this.totalExpenses += transaction.amount;
        }
      });
    });
    
  }

    deleteTransaction(transactionId: string) {
    this.http.delete(`http://localhost:7000/api/transaction/${transactionId}`, { withCredentials: true }).subscribe(response => {
      this.reloadTransaction();
    });
  }

  
  logout() {
    this.http.post('http://localhost:7000/api/auth/logout', {}, { withCredentials: true }).subscribe(response => {
      
      this.router.navigate(['/login']); 
    });
  }
}

