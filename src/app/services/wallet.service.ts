import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
//0xF8A99081C6BafdF0BA6AbFA71879c1D9b2a36496
import Web3 from 'web3';

declare let window: any;

@Injectable({
  providedIn: 'root'
})


export class WalletService {
  web3: any = null;
  get web3Instance(){return this.web3; }

  chainIds:string[]=["0x61"];
  addressUser: any = new BehaviorSubject<string>('');
  loginUser: any = new BehaviorSubject<boolean>(false);

  public ethereum;

  constructor() {
    if(typeof window.ethereum!=='undefined'){
      this.web3 = new Web3(window.ethereum);
    }else{
      Swal.fire({
        icon:'error',
        title:'Oops...',
        text:"You don't have Metamask in your browser"
      })
    }
    const {ethereum} = <any>window
    this.ethereum = ethereum
   }

  public connectWallet = async () => {
    console.log("disparado")
    this.handleIdChainChanged();
  }

  async handleIdChainChanged(){
    const chaindId: string = await this.ethereum.request({method: 'eth_chainId'});

    if(this.chainIds.includes(chaindId)){
      this.handleAccountsChanged();
    }else{
      Swal.fire({
        icon:'error',
        title:'Oops...',
        text:"Select BSC (Mainnet)"
      })
    }

    window.ethereum.on('chainChanged',(res:string)=>{
      if(!this.chainIds.includes(res)){
        this.logout();
        Swal.fire({
          icon:'error',
          title:'Oops...',
          text:"Select BSC (Mainnet)"
        })
      }else{
        if(this.addressUser.getValue()===''){
          this.handleAccountsChanged();
        }else{
          this.authBackend();
        }
      }
    });
  }

 async handleAccountsChanged(){
  const accounts:string[] = await this.ethereum.request({method: 'eth_requestAccounts'});
  this.addressUser.next(accounts[0]);
  this.authBackend();

  window.ethereum.on('accountsChanged',(accounts:string[])=>{
    this.addressUser.next(accounts[0]);
    this.authBackend();
  })
 }

  authBackend(){
  this.loginUser.next(true);
 }

 logout(){
  this.loginUser.next(false);
 }

  public checkWalletConnected = async () => {
    try{
      if(!this.ethereum) return alert("Please install meta mask ")
      const accounts = await this.ethereum.request({method: 'eth_accounts'});
      return accounts;
    }
    catch(e){
      throw new Error("No ethereum object found");
    }
  }
}
