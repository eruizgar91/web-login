import React, { useState } from 'react'
// import logo from './logo.svg'
// import './App.css'
import { ethers } from 'ethers'

function App() {
  const [signatures, setSignatures] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [message, setMessage] = useState<string>('');


  const signMessage = async (message: string) => {
    try {
      console.log({ message })
      if (!window.ethereum)
        throw new Error('No crypto wallet found. Please install it.')

      await window.ethereum.send('eth_requestAccounts')
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const signature = await signer.signMessage(message)
      const address = await signer.getAddress()

      // return signature 
      return {
        message,
        signature,
        address,
      }
    } catch (err) {
      console.log('Error signing message', err)
    }
  }

  const handleSign = async (e: any) => {
    e.preventDefault()
    const sig = await signMessage('message' + Math.random())
    if (sig) {
      setSignatures(sig.signature)
      setAddress(sig.address)
      setMessage(sig.message)
    }
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <button onClick={handleSign}>Connect</button>
        <p>
        signatures: {signatures}
        <br/>
        message: {message}
        <br/>
        address: {address}
        </p>
      </header>
    </div>
  )
}

export default App
