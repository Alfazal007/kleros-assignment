import { rpsAbi } from "@/constants/abi"
import { Link, useParams } from "react-router-dom"
import { isAddress } from "viem"
import { sepolia } from "viem/chains"
import { useAccount, useReadContract, } from "wagmi"
import SelectAndBet from "./SelectAndBet"

export default function BetPage() {
    const { contractAddress } = useParams()
    const { address, isConnected } = useAccount()

    if (!contractAddress || !isAddress(contractAddress)) {
        return (
            <>Invalid contract address</>
        )
    }

    const { data: stakeData, isLoading: stakeLoading, error: stakeError } = useReadContract({
        abi: rpsAbi,
        address: contractAddress,
        chainId: sepolia.id,
        functionName: "stake"
    })

    const { data: secondPlayerAddr, isLoading: secondPlayerAddrLoading, error: secondPlayerAddrError } = useReadContract({
        abi: rpsAbi,
        address: contractAddress,
        chainId: sepolia.id,
        functionName: "j2"
    })


    if (!isConnected) {
        return <>Please connect to your metamask wallet</>
    }

    const isLoading = stakeLoading || secondPlayerAddrLoading;
    const hasError = stakeError || secondPlayerAddrError;

    if (hasError) {
        return (
            <div className="error-container">
                <h1>Error loading contract data</h1>
                <p>{stakeError?.message || secondPlayerAddrError?.message}</p>
            </div>
        )
    }
    if (isLoading) {
        return (
            <div className="loading-container">
                <h1>Loading contract data...</h1>
                <p>Fetching stake and player information</p>
            </div>
        )
    }

    if (secondPlayerAddr != address) {
        return (
            <>You are the not the intended player but you can create a new game at <Link to={"/"} className="text-blue-500">here</Link></>
        )
    }

    return (
        <div>
            <div className="contract-info">
                <SelectAndBet ethToStake={stakeData as bigint} address={contractAddress} />
                <p>Result Page</p>
                <Link to={`${window.location.origin}/result/${contractAddress}`}>Result Page</Link>
            </div>
        </div>
    )
}
