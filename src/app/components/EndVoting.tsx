'use client'
import React, { useState } from 'react'
import { prepareContractCall } from 'thirdweb';
import { useSendTransaction } from 'thirdweb/react';
import votingContract from '../../../constants/contract';

function EndVoting() {

  const { mutate: endVoting, isError: endVotingError } = useSendTransaction();

  const [ votingId, setVotingId ] = useState<any>(null)

  const endVotingHandler = async () => {
    const transaction = prepareContractCall({
        contract: votingContract,
        method: "function endVoting(uint256 _votingId)",
        params: [votingId]
      })
      endVoting(transaction);
  }

  return (
    <div>
      <p className='text-3xl'>Voting ID:</p>
      <input type="number" onChange={(e) => setVotingId(e.target.value)}/>
      <button onClick={endVotingHandler}>End Voting</button>
    </div>
  )
}

export default EndVoting
