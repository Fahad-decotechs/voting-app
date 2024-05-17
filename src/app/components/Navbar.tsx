// Navbar.js
import React from 'react'
import { ConnectButton, useActiveAccount, useReadContract, useSendTransaction } from 'thirdweb/react'
import { client } from '../client';
import votingContract from '../../../constants/contract';

import { prepareContractCall } from 'thirdweb';

function Navbar({ votingId, votingSate }: any) {

  const accountAddress = useActiveAccount()?.address;

  const { data: owner } = useReadContract({
    contract: votingContract,
    method: "function getOwner() external view returns (address)"
  })

  const { data: votingEndTime } = useReadContract({
    contract: votingContract,
    method: "function getEndingTime(uint256 _votingId) public view returns(uint256)",
    params: [votingId]
  })

  const { mutate: endVoting } = useSendTransaction();

  const endVotingHandler = () => {
    const currentUnixTimestamp = Math.floor(Date.now() / 1000);
    if(currentUnixTimestamp < Number(votingEndTime) ) {
      alert("Voting end time not reached");
      return;
    }
    if(accountAddress != owner) {
      alert("Only Admin could End the Voting");
      return;
    }
    const transaction = prepareContractCall({
      contract: votingContract,
      method: "function endVoting(uint256 _votingId)",
      params: [votingId]
    })
    endVoting(transaction);
  }

  return (
    <div className='bg-blue-500 flex justify-between items-center p-4'>
      <div className='text-3xl font-bold text-white'>
        {/* <Link href='/'> */}
        {/* <p onClick={() => navigate("/")}> */}
        Voting
      </div>
      <div className='flex space-x-4'>
          {!votingSate && (<button className='bg-red-600 rounded-2xl text-white p-3 m-2 hover:bg-blue-200 hover:text-red-600' onClick={endVotingHandler}>End Voting</button>)}
          <ConnectButton client={client} />
      </div>
    </div>
  )
}

export default Navbar
