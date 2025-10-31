import { useState } from "react"
import { Move } from "@/constants/types"
import MoveSelect from "../MoveSelect"
import { Button } from "@/components/ui/button"
import { useWriteContract } from "wagmi"
import { sepolia } from "viem/chains"
import { rpsAbi } from "@/constants/abi"

export default function SelectAndBet({ address, ethToStake }: { address: `0x${string}`, ethToStake: bigint }) {
    const [move, setMove] = useState<Move>(Move.Null)
    const { writeContract, isPending, error } = useWriteContract()

    function handlePlay() {
        writeContract({
            address,
            chainId: sepolia.id,
            abi: rpsAbi,
            functionName: "play",
            args: [move],
            value: ethToStake
        })
    }

    return (
        <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
            {
                <>
                    <MoveSelect setMoveChange={setMove} />
                    <Button
                        className="mt-2"
                        onClick={handlePlay}
                        disabled={isPending}
                    >
                        {isPending ? "Writing onchain..." : "Play"}
                    </Button>
                    {
                        error && <>Issue writing to the blockchain</>
                    }
                </>
            }
        </div>
    )
}
