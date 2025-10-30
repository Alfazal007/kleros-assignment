import { type Abi } from 'viem'
import { type Address } from 'viem'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

function DeployContractWithArgs(abi: Abi, bytecode: string, secondPlayer: Address, moveHash: string, stakeAmount: BigInt) {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });
    const deployContract = () => {
        writeContract({
            abi,
            bytecode,
            args: [moveHash, secondPlayer],
            // @ts-ignore
            value: stakeAmount,
        });
    };
}
