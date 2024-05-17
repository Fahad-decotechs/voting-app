'use client'
import StartVoting from "./components/StartVoting";
import CastVote from "./components/CastVote";
import Navbar from "./components/Navbar";
import EndVoting from "./components/EndVoting";
import Winner from "./components/Winner";
import HomePage from "./components/HomePage";
import { useReadContract } from "thirdweb/react";
import votingContract from "../../constants/contract";

export default function Home() {

  const { data: votingId } = useReadContract({
    contract: votingContract,
    method: "function getVotingId() public view returns(uint256)"
  })

  const { data: votingSate } = useReadContract({
    contract: votingContract,
    method: "function getVotingState() public view returns (bool)"
  })

  return (
    <div>
      <Navbar votingId={votingId} votingState={votingSate}/>
      <div className="p-4">
        {/* <HomePage /> */}
        {votingSate ? <CastVote votingId={Number(votingId)} /> : <div>
          <Winner />
          <StartVoting />
        </div>}
      </div>
    </div>
  );
}