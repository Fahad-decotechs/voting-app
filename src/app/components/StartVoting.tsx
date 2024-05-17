'use client'
import React, { useState } from 'react';
import votingContract from '../../../constants/contract';
import { prepareContractCall, toHex } from 'thirdweb';
import { useActiveAccount, useReadContract, useSendTransaction } from 'thirdweb/react';

function StartVoting() {

    const { mutate: startVoting, isError: startVotingError } = useSendTransaction();

    const accountAddress = useActiveAccount()?.address;
    const { data: owner } = useReadContract({
        contract: votingContract,
        method: "function getOwner() external view returns (address)"
    })
    const { data: votingSate } = useReadContract({
        contract: votingContract,
        method: "function getVotingState() public view returns (bool)"
    })

    const [candidateNumbers, setCandidateNumbers] = useState<number>(0);
    const [candidates, setCandidates] = useState<string[]>([]);
    const [bytes32Candidates, setBytes32Candidates] = useState<any>([]);
    const [endTime, setEndTime] = useState<any>(null)

    const handleCandidateNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const num = parseInt(e.target.value);
        setCandidateNumbers(num);
        const newCandidates = Array.from({ length: num }, (_, i) => "");
        setCandidates(newCandidates);
    };

    const handleCandidateNameChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newCandidates = [...candidates];
        newCandidates[index] = e.target.value;
        setCandidates(newCandidates);

        const newBytes = [...bytes32Candidates];
        // newBytes[index] = stringToBytes(e.target.value, {
        //     size: 32
        // });
        newBytes[index] = toHex(e.target.value, {
            size: 32
        })
        setBytes32Candidates(newBytes)
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const unixTimestamp = new Date(e.target.value).getTime() / 1000;
        setEndTime(unixTimestamp);
    }

    const startVotingHandler = async () => {
        const transaction = prepareContractCall({
            contract: votingContract,
            method: "function startVoting(bytes32[] memory _candidates, uint256 _endingTime)",
            params: [bytes32Candidates, endTime]
        })
        startVoting(transaction)
    }

    return (
        <div className="max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between p-6 bg-white rounded-lg shadow-md overflow-hidden">
            {accountAddress == owner ? !votingSate ? <div className="w-full md:w-1/2 md:pr-6">
                <h2 className="text-3xl font-bold mb-6 text-blue-600 text-center md:text-left">Start Voting</h2>
                <div className="mb-4">
                    <label htmlFor="candidateNumbers" className="block text-lg font-semibold mb-2 text-gray-800">Number of candidates:</label>
                    <input type="number" id="candidateNumbers" className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-500" value={candidateNumbers} onChange={handleCandidateNumberChange} />
                </div>
                <div className="mb-4">
                    {candidates.map((candidate, index) => (
                        <div key={index} className={`relative mt-4 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} rounded-md overflow-hidden transition duration-300 transform hover:scale-105`}>
                            <input type="text" id={`candidate-${index + 1}`} className="p-2 w-full border focus:outline-none focus:ring focus:border-blue-500" placeholder={`Candidate ${index + 1}`} value={candidate} onChange={(e) => handleCandidateNameChange(index, e)} />
                        </div>
                    ))}
                </div>
                <div className="mb-4">
                    <label htmlFor="votingDateTime" className="block text-lg font-semibold mb-2 text-gray-800">Voting End Time:</label>
                    <input type="datetime-local" id="votingDateTime" className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-500" onChange={handleDateChange} />
                </div>
                <div className="text-center md:text-left">
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-600 transition duration-300" onClick={startVotingHandler}>Start Voting</button>
                </div>
            </div> : <p className='text-2xl font-medium'>Already Voting Started</p> : <p className='text-2xl font-medium'>Only Admin Could Start Voting</p>}
            <div className="w-full md:w-1/2 mt-6 md:mt-0">
                <img src="https://source.unsplash.com/800x600/?voting" alt="Voting" className="w-full h-auto rounded-lg transform hover:scale-105 transition duration-60" />
            </div>
        </div>
    );
}

export default StartVoting;
