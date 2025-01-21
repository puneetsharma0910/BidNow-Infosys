import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuctionService } from '../auction.service'; // Import AuctionService

interface Auction {
  id: string;
  title: string;
  imageUrl?: string;
  info: string;
  timeLeft: string;
  startTime?: Date;
  endTime?: Date;
  currentBid?: number;
  minimumBid?: number;
  seller?: string;
  status: 'ongoing' | 'upcoming' | 'past';
}

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, FormsModule, MatSnackBarModule],
})
export class DashboardComponent implements OnInit, OnDestroy {
  upcomingAuctions: Auction[] = [];
  currentAuctions: Auction[] = [];
  filteredUpcomingAuctions: Auction[] = [];
  filteredCurrentAuctions: Auction[] = [];
  searchQuery: string = '';
  timerInterval: any;

  // For adding and managing auctions
  newAuction: Auction = {
    id:'',
    title: '',
    info: '',
    currentBid: 0,
    minimumBid: 0,
    imageUrl: '',
    timeLeft: '',
    status: 'upcoming'
  };
  showAddAuctionForm: boolean = false;

  constructor(
    public router: Router,
    private snackBar: MatSnackBar,
    private auctionService: AuctionService // Inject AuctionService
  ) {}

  ngOnInit(): void {
    // Fetch data from the AuctionService
    this.auctionService.upcomingAuctions$.subscribe((auctions) => {
      this.upcomingAuctions = auctions;
      this.filteredUpcomingAuctions = [...this.upcomingAuctions];
    });

    this.auctionService.currentAuctions$.subscribe((auctions) => {
      this.currentAuctions = auctions;
      this.filteredCurrentAuctions = [...this.currentAuctions];
    });

    this.timerInterval = setInterval(() => this.updateTimers(), 1000);
  }

  toggleAddAuctionForm(): void {
    this.showAddAuctionForm = !this.showAddAuctionForm;
  }

  addAuction(): void {
    if (!this.newAuction.title || !this.newAuction.info || !this.newAuction.minimumBid) {
      this.snackBar.open('Please fill in all required fields.', 'Close', { duration: 3000 });
      return;
    }
  
    // Ensure the id is always a string when adding a new auction
    const newAuction: Auction = {
      ...this.newAuction,
      id: `auction_${Date.now()}`, // Create a unique ID based on timestamp
      startTime: new Date(),
      timeLeft: '7d 0h 0m 0s',
      info: this.newAuction.info || 'No additional information provided', // Fallback for info
      status: 'upcoming', // Add the status property
    };
  
    // Add auction to the service
    this.auctionService.addAuction(newAuction);
   
    this.filteredCurrentAuctions = [...this.currentAuctions];
  
    this.toggleAddAuctionForm();
    this.snackBar.open('Auction added successfully!', 'Close', { duration: 3000 });
  }
  

  deleteAuction(auction: Auction): void {
    this.auctionService.deleteAuction(auction.id!);
    this.snackBar.open('Auction deleted successfully.', 'Close', { duration: 3000 });
  }

  updateTimers(): void {
    const now = new Date();
    const formatTime = (ms: number): string => {
      const days = Math.floor(ms / (1000 * 60 * 60 * 24));
      const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((ms / (1000 * 60)) % 60);
      const seconds = Math.floor((ms / 1000) % 60);
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const updateTime = (auction: Auction, key: 'startTime' | 'endTime') => {
      if (!auction[key]) return;
      const diff = auction[key]!.getTime() - now.getTime();
      auction.timeLeft = diff > 0 ? formatTime(diff) : 'Expired';
    };

    this.upcomingAuctions.forEach((auction) => updateTime(auction, 'startTime'));
    this.currentAuctions.forEach((auction) => updateTime(auction, 'endTime'));
  }

  onSearch(event: any): void {
    const query = event.target.value.toLowerCase();
    this.filteredUpcomingAuctions = this.upcomingAuctions.filter((a) =>
      a.title.toLowerCase().includes(query)
    );
    this.filteredCurrentAuctions = this.currentAuctions.filter((a) =>
      a.title.toLowerCase().includes(query)
    );
  }

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newAuction.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onPlaceBid(auction: Auction): void {
    const bidAmount = prompt(`Enter your bid for ${auction.title}. Current bid is $${auction.currentBid || 0}`);
    if (bidAmount) {
      const bid = parseFloat(bidAmount);
      if (isNaN(bid) || bid <= (auction.currentBid || 0)) {
        this.snackBar.open('Invalid bid amount. It must be higher than the current bid.', 'Close', { duration: 3000 });
      } else {
        auction.currentBid = bid;
        this.snackBar.open(`Bid of $${bid} placed successfully on ${auction.title}`, 'Close', { duration: 3000 });
      }
    }
  }

  viewAuctionDetail(auction: Auction): void {
    this.router.navigate(['./auction-detail'], {
      state: { auction, auctions: this.currentAuctions },
    });
  }

  onBid(auction: Auction): void {
    console.log(`Reminder clicked for auction: ${auction.title}`);
    this.snackBar.open(
      `Reminder set successfully for "${auction.title}". We'll notify you before it starts!`,
      'Close',
      { duration: 3000 }
    );
  }  

  logout(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }
}