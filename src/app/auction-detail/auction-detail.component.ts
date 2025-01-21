import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar for notifications

interface Bid {
  amount: number;
  bidder: string;
  timestamp: Date;
}

@Component({
  standalone: true,
  selector: 'app-auction-detail',
  templateUrl: './auction-detail.component.html',
  styleUrls: ['./auction-detail.component.css'],
  imports: [CommonModule, FormsModule],  // Add CommonModule and FormsModule here
})
export class AuctionDetailComponent implements OnInit, OnDestroy {
  public auction: any = {};
  public allAuctions: any[] = [];
  public bidHistory: Bid[] = [];
  public timerInterval: any;
  public currentBidAmount: number = 0;
  public userBidAmount: number | null = null;
  public timer: string = '';

  constructor(public router: Router, private snackBar: MatSnackBar) {
    const state = history.state || {};
    this.auction = state['auction'] || {};
    this.allAuctions = state['auctions'] || [];
    this.currentBidAmount = this.auction.currentBid || 0;
  }

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(this.auction.endTime).getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(this.timerInterval);
        this.timer = 'Auction Ended';
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        this.timer = `${hours}h ${minutes}m ${seconds}s`;
      }
    }, 1000);
  }

  placeBid(): void {
    if (this.userBidAmount && this.userBidAmount > this.currentBidAmount) {
      this.currentBidAmount = this.userBidAmount;
      this.bidHistory.push({
        amount: this.userBidAmount,
        bidder: 'User', // In a real app, this should come from the logged-in user's data
        timestamp: new Date(),
      });
      this.userBidAmount = null; // Reset the user bid input
      this.snackBar.open(`Bid of $${this.userBidAmount} placed successfully!`, 'Close', { duration: 3000 });
    } else {
      alert('Bid must be higher than the current bid!');
    }
  }

  viewNextAuction(): void {
    const currentIndex = this.allAuctions.findIndex((a) => a.id === this.auction.id);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % this.allAuctions.length;
      this.auction = this.allAuctions[nextIndex];
      this.currentBidAmount = this.auction.currentBid || 0;
      this.bidHistory = []; // Reset bid history when switching auctions
    }
  }

  viewPreviousAuction(): void {
    const currentIndex = this.allAuctions.findIndex((a) => a.id === this.auction.id);
    if (currentIndex !== -1) {
      const previousIndex = (currentIndex - 1 + this.allAuctions.length) % this.allAuctions.length;
      this.auction = this.allAuctions[previousIndex];
      this.currentBidAmount = this.auction.currentBid || 0;
      this.bidHistory = []; // Reset bid history when switching auctions
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard'], { 
      state: { 
        auctions: this.allAuctions 
      } 
    });
  }
}
