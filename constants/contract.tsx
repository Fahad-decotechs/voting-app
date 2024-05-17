'use client'
import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { votingContractAddress } from "./contractAddress";
import { client } from "@/app/client";

const coreTestnetBlockchain = defineChain({
    id: 1115,
    rpc: "https://rpc.test.btcs.network"
})

const votingContract = getContract({
    client,
    chain: coreTestnetBlockchain,
    address: votingContractAddress,
})

export default votingContract