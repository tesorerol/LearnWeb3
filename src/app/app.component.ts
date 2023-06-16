import { ChangeDetectorRef, Component } from '@angular/core';
import { WalletService } from './services/wallet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Login with Wallet';
  loginUser: boolean = false;
  addressUser:string = "";
  adressUserView: boolean = false;
  web3:any;

  public walletConnected: boolean = false;
  public walletId: string = '';

  constructor(private cdr: ChangeDetectorRef ,private walletService: WalletService){
    this.web3 = this.walletService.web3Instance;
  }

  connectToWallet  = () => {
    this.walletService.connectWallet();
  }

  checkWalletConnected = async () => {
    this.walletService.loginUser.subscribe((res:boolean)=>{
      this.loginUser=res;
      (!this.loginUser) ? this.adressUserView = false : this.adressUserView = true;
      this.cdr.detectChanges();
    })

    this.walletService.addressUser.subscribe((res:string)=>{
      this.addressUser = res;
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    this.checkWalletConnected();
  }
}
