'use client'
import React from 'react'
import { hexToString, prepareContractCall } from 'thirdweb'
import man from '../../../public/Images/man.png'
import votingContract from '../../../constants/contract';
import { useReadContract, useSendTransaction } from 'thirdweb/react';
import ProgressBar from '@ramonak/react-progress-bar';

function CandidateCard({ votingId, bytesCandidate, totalVotes }: any) {

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
            params: [votingId, bytesCandidate]
        })
        castVote(transaction);
    }

    const { data: voterStatus } = useReadContract({
        contract: votingContract,
        method: "function getVoterStatus(uint256 _votingId) public view returns(bool)",
        params: [votingId]
    })

    const { data: candidatesVotes } = useReadContract({
        contract: votingContract,
        method: "function getCandidateVotes(uint256 _votingId, bytes32 _candidate) public view returns(uint256)",
        params: [votingId, bytesCandidate]
    })

    const candidate = hexToString(bytesCandidate, {
        size: 32
    });

    return (
        <div className='flex flex-col justify-center items-center bg-slate-300 rounded-2xl w-72 m-4 p-4'>
            <div className='w-48 h-48'>
                <img src={man.src} alt="candidate" />
            </div>
            <div className='text-xl font-semibold text-center mt-4 text-gray-800 shadow-lg'>
                {candidate}
            </div>

            <div className='w-[80%] p-2'>
                <ProgressBar completed={candidatesVotes? Number(candidatesVotes) : 0} maxCompleted={Number(totalVotes)} customLabel={candidatesVotes? Number(candidatesVotes).toString() : '0'} bgColor='#3292c2'/>
            </div>

            <div className='p-2'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
            <div className='bg-[#f56c42] text-white w-[80%] flex justify-center items-center rounded-full py-2 px-4 shadow-lg hover:bg-blue-500 hover:text-white transition duration-300'>
                <button className="text-xl font-bold" onClick={castVoteHandler}>Vote</button>
            </div>


        </div>
    )
}

export default CandidateCard
