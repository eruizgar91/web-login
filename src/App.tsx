import React, { useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'

function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [signatures, setSignatures] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [message, setMessage] = useState<string>('')

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
    console.log(searchParams.get('id'))
    console.log(searchParams.get('token'))

    const sig = await signMessage(searchParams.get('token')!)
    if (sig) {
      setSignatures(sig.signature)
      setAddress(sig.address)
      setMessage(sig.message)
    }
    axios
      .put(
        `http://localhost:3000/signups/${searchParams.get('id')}`,
        {
          token: sig?.message,
          responseTimestamp: Date.now().toString(),
          signature: sig?.signature,
          walletAddress: sig?.address
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then((res) => res.data)
      .then((json) => console.log(json))
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <button onClick={handleSign}>Connect</button>
        <p>
          signatures: {signatures}
          <br />
          message: {message}
          <br />
          address: {address}
        </p>
      </header>
    </div>
  )
}

export default App
