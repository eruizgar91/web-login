import React, { useState } from 'react'
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
    const token = ethers.utils.hexValue(ethers.utils.randomBytes(20))
    const sig = await signMessage(token)
    if (sig) {
      setSignatures(sig.signature)
      setAddress(sig.address)
      setMessage(sig.message)
    }
    fetch(`http://localhost:3000/posts`, {method:'POST'}).then((response) => console.log(response))
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
