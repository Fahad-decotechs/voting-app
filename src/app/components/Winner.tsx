'use client'
import React, { useEffect, useState } from 'react'
import { useReadContract, useSendTransaction } from 'thirdweb/react'
import votingContract from '../../../constants/contract'
import man from '../../../public/Images/man.png'
import { hexToString, prepareContractCall } from 'thirdweb'
import ProgressBar from '@ramonak/react-progress-bar'

function Winner() {

  const [candidate, setCandidate] = useState('');

  const { data: votingId } = useReadContract({
    contract: votingContract,
    method: "function getVotingId() public view returns(uint256)"
  })
  const nextvotingId: any = Number(votingId);

  const { data: winner } = useReadContract({
    contract: votingContract,
    method: "function getWinner(uint256 _votingId) public view returns(bytes32)",
    params: [nextvotingId]
  })
  const newWinner: any = winner

  const { mutate: castVote, isError: castVoteError } = useSendTransaction();
  const castVoteHandler = async () => {
    console.log("votes status: " + voterStatus)
    if (voterStatus) {
      console.log("You have Already Voted")
      alert("You have Already Voted");
      return
    }
    const transaction = prepareContractCall({
      contract: votingContract,
      method: "function castVote(uint256 _votingId, bytes32 _candidate)",
      params: [nextvotingId, newWinner]
    })
    castVote(transaction);
  }

  const { data: voterStatus } = useReadContract({
    contract: votingContract,
    method: "function getVoterStatus(uint256 _votingId) public view returns(bool)",
    params: [nextvotingId]
  })

  const { data: candidatesVotes } = useReadContract({
    contract: votingContract,
    method: "function getCandidateVotes(uint256 _votingId, bytes32 _candidate) public view returns(uint256)",
    params: [nextvotingId, newWinner]
  })

  const { data: totalVotes } = useReadContract({
    contract: votingContract,
    method: "function getTotalVotes(uint256 _votingId) public view returns(uint256)",
    params: [nextvotingId]
  })

  useEffect(() => {
    if(newWinner && Number(newWinner)!=0) {
      setCandidate(hexToString(newWinner, {
        size: 32
      }))
    }
  }, [newWinner])

  return (
    <div>
      {Number(winner) == 0 ?
        <div>
          {/* No Winner Availble */}
        </div>
        : <div className='flex flex-col justify-center items-center min-h-screen bg-gray-100'>
          <div className='text-3xl font-bold text-black mb-8'>
            Our Winner
          </div>
        <div className='flex flex-col justify-center items-center bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-2xl w-[60%] p-6 shadow-2xl'>
          
          <div className='w-48 h-48'>
            <img src={man.src} alt="candidate" className='rounded-full border-4 border-white shadow-lg' />
          </div>
          <div className='text-xl font-semibold text-center mt-4 text-white shadow-lg'>
            {candidate}
          </div>
          <div className='w-[80%] p-2'>
            <ProgressBar
              completed={candidatesVotes ? Number(candidatesVotes) : 0}
              maxCompleted={Number(totalVotes)}
              customLabel={candidatesVotes ? Number(candidatesVotes).toString() : '0'}
              bgColor='#4caf50'  // Changed to a green color
              labelColor='#fff'
              baseBgColor='#c8e6c9'  // Light green base
              height='15px'
              borderRadius='10px'
              transitionDuration='1s'
            />
          </div>
          <div className='p-2 text-white text-center'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
          <div className='text-white text-2xl font-bold mt-4'>
            Winner
          </div>
        </div>
      </div>
      
      
      
      }
    </div>
  )
}

export default Winner
