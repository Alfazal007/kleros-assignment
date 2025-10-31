import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { rpsAbi } from "@/constants/abi"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { isAddress } from "viem"
import { sepolia } from "viem/chains"
import { useAccount, useReadContract, useWriteContract, } from "wagmi"
import MoveSelect from "../MoveSelect"
import { Move } from "@/constants/types"
import { toast } from "sonner"
import TimeoutComponent from "./Timeout"
import { Button } from "@/components/ui/button"

export default function Result() {
    const { contractAddress } = useParams()
    const { address, isConnected } = useAccount()
    const [salt, setSalt] = useState<number>()
    const [move, setMove] = useState<Move>(Move.Null)

    const { writeContract, error, isPending } = useWriteContract()

    if (!contractAddress || !isAddress(contractAddress)) {
        return (
            <>Invalid contract address</>
        )
    }

    const { data: firstPlayerAddr, isLoading: firstPlayerAddrLoading, error: firstPlayerAddrError } = useReadContract({
        abi: rpsAbi,
        address: contractAddress,
        chainId: sepolia.id,
        functionName: "j1"
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

    const isLoading = firstPlayerAddrLoading || secondPlayerAddrLoading;
    const hasError = firstPlayerAddrError || secondPlayerAddrError;

    if (hasError) {
        return (
            <div className="error-container">
                <h1>Error loading contract data</h1>
                <p>{firstPlayerAddrError?.message || secondPlayerAddrError?.message}</p>
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

    if (address != firstPlayerAddr && address != secondPlayerAddr) {
        return (
            <div className="loading-container">
                <h1>Loading contract data...</h1>
                <p>You are not part of the game</p>
            </div>
        )
    }

    function getResult() {
        writeContract({
            address: contractAddress as `0x${string}`,
            chainId: sepolia.id,
            abi: rpsAbi,
            functionName: "solve",
            args: [move, salt],
        })
    }

    if (error) {
        toast(`Issue calling the solve function ${error}`)
    }

    return (
        <>
            {
                address == firstPlayerAddr && <>
                    <MoveSelect setMoveChange={setMove} />
                    <Label className="mt-4 mb-1" htmlFor="salt">Salt (Remember this number to generate the final result)</Label>
                    <Input type="number" id="salt" value={salt} onChange={(e) => { setSalt(Number(e.target.value)) }} min={0} max={Number.MAX_SAFE_INTEGER} />
                    <Button onClick={getResult} disabled={isPending}>Declare</Button>
                </>
            }
            <TimeoutComponent contractAddress={contractAddress} timeoutFunction={address == firstPlayerAddr ? "j2Timeout" : "j1Timeout"} />
        </>
    )
}
