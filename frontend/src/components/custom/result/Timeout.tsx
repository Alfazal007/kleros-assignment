import { Button } from "@/components/ui/button";
import { rpsAbi } from "@/constants/abi";
import { toast } from "sonner";
import { sepolia } from "viem/chains";
import { useWriteContract } from "wagmi";

export default function TimeoutComponent({ contractAddress, timeoutFunction }: { contractAddress: `0x${string}`, timeoutFunction: string }) {
    const { writeContract, isPending, error } = useWriteContract()

    function timeoutHandler() {
        writeContract({
            address: contractAddress as `0x${string}`,
            chainId: sepolia.id,
            abi: rpsAbi,
            functionName: timeoutFunction,
            args: []
        })
    }

    if (error) {
        toast("Issue calling timeout function")
    }

    return (
        <Button onClick={timeoutHandler} disabled={isPending}>Timeout</Button>
    )
}
