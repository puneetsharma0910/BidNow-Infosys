import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuctionService } from '../auction.service'; // Import your AuctionService


interface Auction {
  id: string;
  title: string;
  info: string;
  imageUrl?: string;
  timeLeft: string;
  currentBid?: number;
  minimumBid?: number;
  status: 'ongoing' | 'upcoming' | 'past' | 'pending' | 'approved' | 'rejected';
}

interface User {
  name: string;
  email: string;
}

interface Dispute {
  id: string;
  auctionTitle: string;
  reason: string;
  status: 'open' | 'resolved';
}

interface Stats {
  totalUsers: number;
  totalAuctions: number;
  activeBids: number;
  totalDisputes: number;
  openDisputes: number;
  resolvedDisputes: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [CommonModule, FormsModule,],
})
export class AdminDashboardComponent implements OnInit {
  currentAuctions: Auction[] = [];
  filteredCurrentAuctions: Auction[] = [];
  approvedAuctions: Auction[] = [];
  rejectedAuctions: Auction[] = [];
  disputes: Dispute[] = []; // New property for disputes
  filteredDisputes: Dispute[] = [];
  showAddAuctionForm: boolean = false;
  newAuction: Auction = { 
    id: `auction_${Date.now()}`, 
    title: '', 
    info: '', 
    currentBid: 0, 
    minimumBid: 0, 
    timeLeft: '', 
    status: 'ongoing' 
  };
  auctionImage: File | null = null;
  selectedFilter: 'current' | 'upcoming' | 'past' = 'current';
  selectedDisputeStatus: 'all' | 'open' | 'resolved' = 'all'; // New filter for disputes
  searchQuery: string = '';
  disputeSearchQuery: string = ''; // New property for searching disputes
  users: User[] = [
    { name: 'John Doe', email: 'john.doe@example.com' },
    { name: 'Jane Smith', email: 'jane.smith@example.com' },
  ];
  stats: Stats = { 
    totalUsers: this.users.length, 
    totalAuctions: 20, 
    activeBids: 10, 
    totalDisputes: 5, 
    openDisputes: 3, 
    resolvedDisputes: 2 
  };

  // Injecting the AuctionService
  private auctionService = inject(AuctionService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadAuctions();
    this.loadDisputes(); // Load disputes data
    this.applyFilters();
    this.filterDisputes(); // Apply default dispute filter
  }

  loadAuctions(): void {
    this.auctionService.currentAuctions$.subscribe((auctions) => {
      this.currentAuctions = auctions;
      this.applyFilters();
    });
  }

  toggleAddAuctionForm(): void {
    this.showAddAuctionForm = !this.showAddAuctionForm;
  }

  addAuction(): void {
    if (!this.newAuction.title || !this.newAuction.info || !this.newAuction.minimumBid) {
      this.snackBar.open('Please fill in all required fields.', 'Close', { duration: 3000 });
      return;
    }

    this.auctionService.addAuction({
      ...this.newAuction,
      id: `auction_${Date.now()}`,
      timeLeft: '7d 0h 0m',
      imageUrl: this.auctionImage ? `images/${this.auctionImage.name}` : undefined,
      status: 'ongoing',
    });

    this.applyFilters();
    this.toggleAddAuctionForm();
    this.snackBar.open('Auction added successfully!', 'Close', { duration: 3000 });
  }

  viewAuctionDetail(auction: Auction): void {
    this.router.navigate(['/auction-detail', auction.id]);
  }

  // Search Auctions
  searchAuctions(): void {
    this.filteredCurrentAuctions = this.currentAuctions.filter((auction) =>
      auction.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Apply Timeframe Filters
  applyFilters(): void {
    const filterMap = {
      current: 'ongoing',
      upcoming: 'upcoming',
      past: 'past',
    };

    this.filteredCurrentAuctions = this.currentAuctions.filter(
      (auction) => auction.status === filterMap[this.selectedFilter]
    );
  }

  approveAuction(auction: Auction): void {
    auction.status = 'approved';
    this.approvedAuctions.push(auction);
    this.snackBar.open(`Auction "${auction.title}" approved successfully!`, 'Close', { 
      duration: 3000, 
      verticalPosition: 'top', 
      horizontalPosition: 'center' 
    });
    this.applyFilters();
  }
  
  rejectAuction(auction: Auction): void {
    auction.status = 'rejected';
    this.rejectedAuctions.push(auction);
    this.snackBar.open(`Auction "${auction.title}" rejected.`, 'Close', { 
      duration: 3000, 
      verticalPosition: 'top', 
      horizontalPosition: 'center' 
    });
    this.applyFilters();
  }  
  
  deleteAuction(auction: Auction): void {
    this.auctionService.deleteAuction(auction.id);
    this.snackBar.open(`Auction "${auction.title}" deleted successfully.`, 'Close', { 
      duration: 3000, 
      verticalPosition: 'top', 
      horizontalPosition: 'center' 
    });
    this.applyFilters();
  }
  
  // Mock actions for users
  viewUserDetails(user: User): void {
    // Use a unique identifier such as email or name
    this.router.navigate(['/user-detail', user.email]); 
  }
  

  blockUser(user: User): void {
    this.snackBar.open(`Blocking user: ${user.name}`, 'Close', { duration: 3000 });
  }

  deleteUser(user: User): void {
    const index = this.users.findIndex(u => u.email === user.email);
    if (index !== -1) {
      this.users.splice(index, 1); // Remove the user from the array
      this.stats.totalUsers = this.users.length; // Update the total users count
      this.snackBar.open(`User "${user.name}" deleted successfully.`, 'Close', { 
        duration: 3000, 
        verticalPosition: 'top', 
        horizontalPosition: 'center' 
      });
    } else {
      this.snackBar.open(`User "${user.name}" not found.`, 'Close', { duration: 3000 });
    }
  }

  viewDetailedLogs(): void {
    this.router.navigate(['/admin-dashboard/charts']);
  }
  
  navigateToDisputes():void{
    this.router.navigate(['/disputes']);
  }

  loadDisputes(): void {
    // Mock disputes data
    this.disputes = [
      { id: 'dispute_1', auctionTitle: 'Antique Vase Auction', reason: 'Misleading description', status: 'open' },
      { id: 'dispute_2', auctionTitle: 'Vintage Watch Auction', reason: 'Delayed shipping', status: 'resolved' },
      { id: 'dispute_3', auctionTitle: 'Car Auction', reason: 'Payment issue', status: 'open' },
    ];
    this.filterDisputes();
  }

  filterDisputes(): void {
    if (this.selectedDisputeStatus === 'all') {
      this.filteredDisputes = this.disputes;
    } else {
      this.filteredDisputes = this.disputes.filter(
        (dispute) => dispute.status === this.selectedDisputeStatus
      );
    }
  }

  searchDisputes(): void {
    this.filteredDisputes = this.disputes.filter((dispute) =>
      dispute.auctionTitle.toLowerCase().includes(this.disputeSearchQuery.toLowerCase())
    );
  }

  resolveDispute(dispute: Dispute): void {
    dispute.status = 'resolved';
    this.stats.openDisputes--;
    this.stats.resolvedDisputes++;
    this.snackBar.open(`Dispute for "${dispute.auctionTitle}" resolved successfully!`, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
    this.filterDisputes();
  }

  escalateDispute(dispute: Dispute): void {
    this.snackBar.open(`Dispute for "${dispute.auctionTitle}" escalated for further review.`, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }


  logout(): void {
    this.router.navigate(['/']);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.auctionImage = input.files[0];
    }
  }

  // Update Auction Status
  updateAuctionStatus(auction: Auction, status: 'ongoing' | 'upcoming' | 'past'): void {
    auction.status = status;
    this.snackBar.open(`Auction status updated to ${status}.`, 'Close', { duration: 3000 });
    this.applyFilters();
  }
}
