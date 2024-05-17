'use client'
import React from 'react'
import { useReadContract } from 'thirdweb/react';
import votingContract from '../../../constants/contract';
import CandidateCard from './CandidateCard';

function CastVote({votingId}:any) {

  const { data: candidates } = useReadContract({
    contract: votingContract,
    method: "function getAllCandidates(uint256 _votingId) public view returns(bytes32[] memory)",
    params: [votingId]
  })

  const { data: totalVotes} = useReadContract({
    contract: votingContract,
    method: "function getTotalVotes(uint256 _votingId) public view returns(uint256)",
    params: [votingId]
  })

  return (
    <div>
      <div className='flex justify-center items-center h-full'>
        <p className='text-3xl font-bold'>Vote to a Candidate</p>
      </div>

      <div className="flex justify-center items-center h-full mt-5">
        <div className="flex flex-wrap justify-center w-full max-w-screen-lg">
          {candidates?.map((index: any) => (
            <CandidateCard key={index} votingId={votingId} bytesCandidate={index} totalVotes={totalVotes}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CastVote
