import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Column {
  label: string;
  field: string;
}

@Component({
  selector: 'app-table-edit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-edit.component.html',
  styleUrl: './table-edit.component.scss'
})
export class TableEditComponent implements OnInit {
  columns: Column[] = [
    { label: 'Company', field: 'company' },
    { label: 'Email', field: 'email' },
    { label: 'Name', field: 'name' },
    { label: 'Phone', field: 'phone' },
  ];

  data: any[] = [];
  loading = false;

  loadData() {
    this.loading = true;
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data) => {
        this.data = data.map((user: any) => ({
          ...user,
          address: `${user.address.city}, ${user.address.street}`,
          company: user.company.name,
        }));
        this.loading = false;
      });
  }

  onUpdate(columns: any, rows: any) {
    // here you can create a POST request to update your database
    console.log(columns, rows);
  }

  ngOnInit() {
    // Initial load if needed
    this.loadData();
  }
}
