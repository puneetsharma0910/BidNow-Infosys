import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { Router } from '@angular/router';

interface Auction {
  id: string;
  title: string;
  status: string;
}

interface User {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  numberOfBids: number;
  participatedAuctions: Auction[];
  accountStatus: string;
  lastLogin: string;
  isBlocked: boolean;
}

@Component({
  selector: 'app-user-detail',
  standalone: true,
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
  imports: [CommonModule, FormsModule],  // Add FormsModule here
})
export class UserDetailComponent implements OnInit {
  userId!: string;
  userDetails!: User;
  auctionSearchQuery = '';
  auctionStatusFilter = 'all';
  filteredAuctions: Auction[] = [];

  private users: User[] = [
    {
      id: 'john.doe@example.com',
      name: 'John Doe',
      address: '123 Elm Street, Springfield',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      numberOfBids: 15,
      participatedAuctions: [
        { id: '1', title: 'Antique Vase Auction', status: 'completed' },
        { id: '2', title: 'Modern Art Auction', status: 'completed' },
        { id: '3', title: 'Luxury Watch Auction', status: 'ongoing' },
        { id: '4', title: 'Sports Car Auction', status: 'ongoing' },
      ],
      accountStatus: 'Active',
      lastLogin: '2024-12-20',
      isBlocked: false,
    },
    {
      id: 'jane.smith@example.com',
      name: 'Jane Smith',
      address: '456 Oak Avenue, Metropolis',
      email: 'jane.smith@example.com',
      phone: '987-654-3210',
      numberOfBids: 10,
      participatedAuctions: [
        { id: '5', title: 'Classic Car Auction', status: 'completed' },
        { id: '6', title: 'Vintage Jewelry Auction', status: 'completed' },
        { id: '7', title: 'Furniture Auction', status: 'ongoing' },
        { id: '8', title: 'Fine Art Auction', status: 'ongoing' },
      ],
      accountStatus: 'Active',
      lastLogin: '2024-12-19',
      isBlocked: false,
    },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchUserDetails();
    this.filterAuctions();
  }

  fetchUserDetails(): void {
    const user = this.users.find((u) => u.id === this.userId);
    if (user) {
      this.userDetails = user;
    } else {
      console.error(`User with id ${this.userId} not found.`);
    }
  }

  // Add the method to navigate to the admin dashboard
  goToAdminDashboard(): void {
    this.router.navigate(['/admin-dashboard']);  // Navigate to the admin dashboard route
  }

  sendMessage(): void {
    alert(`Message sent to ${this.userDetails.email}`);
  }

  blockUser(): void {
    this.userDetails.isBlocked = true;
    alert(`${this.userDetails.name} has been blocked.`);
  }

  unblockUser(): void {
    this.userDetails.isBlocked = false;
    alert(`${this.userDetails.name} has been unblocked.`);
  }

  filterAuctions(): void {
    this.filteredAuctions = this.userDetails.participatedAuctions.filter(
      (auction) =>
        (this.auctionStatusFilter === 'all' ||
          auction.status === this.auctionStatusFilter) &&
        auction.title.toLowerCase().includes(this.auctionSearchQuery.toLowerCase())
    );
  }

  sortAuctions(property: keyof Auction): void {
    this.filteredAuctions.sort((a, b) =>
      a[property].localeCompare(b[property])
    );
  }

  viewAuctionDetails(auctionId: string): void {
    alert(`Viewing details for auction ID: ${auctionId}`);
  }
}
