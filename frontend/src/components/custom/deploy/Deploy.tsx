import {
    useAccount,
    useChainId,
    useSwitchChain,
    useWaitForTransactionReceipt,
    useDeployContract
} from "wagmi"
import { rpsAbi } from "@/constants/abi"
import { rpsByteCode } from "@/constants/byteCode"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { Move } from "@/constants/types"
import MoveSelect from "../MoveSelect"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { isAddress, solidityPackedKeccak256 } from "ethers"
import { parseEther } from "viem"
import { toast } from "sonner"
import { CopyButton } from "../CopyButton"
import { Link } from "react-router"

function generateHash(move: number, salt: number): string {
    const hash = solidityPackedKeccak256(['uint8', 'uint256'], [move, salt])
    return hash
}

export default function DeployContract() {
    const { isConnected } = useAccount()
    const chainId = useChainId()
    const { switchChain } = useSwitchChain()
    const [secondPlayer, setSecondPlayer] = useState<string>("")
    const [move, setMove] = useState<Move>(Move.Null)
    const [stakeAmount, setStakeAmount] = useState<string>("0")
    const [salt, setSalt] = useState<number>(0)
    const [contractAddress, setContractAddress] = useState<`0x${string}`>()

    const { deployContract, data: hash, isPending } = useDeployContract()
    const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
        hash,
    })
    const handleDeploy = () => {
        if (!isAddress(secondPlayer) || move == Move.Null) {
            toast("Invalid recipient address or check move to not be null")
            return
        }
        let ethStaked = parseEther(stakeAmount)
        let moveHash = generateHash(move, salt)
        deployContract({
            abi: rpsAbi,
            bytecode: rpsByteCode,
            args: [moveHash, secondPlayer],
            value: ethStaked,
        })
    }

    useEffect(() => {
        if (!receipt || !receipt.contractAddress) {
            return
        }
        setContractAddress(receipt.contractAddress)
    }, [receipt])

    const isSepoliaNetwork = chainId === 11155111

    return (
        <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
            {!isConnected && <p>Please connect your wallet</p>}

            {isConnected && !isSepoliaNetwork && (
                <div>
                    <p>Switch to Sepolia network</p>
                    <button onClick={() => switchChain({ chainId: 11155111 })}>
                        Switch to Sepolia
                    </button>
                </div>
            )}

            {
                isConnected && isSepoliaNetwork && (
                    <>
                        <MoveSelect setMoveChange={setMove} />
                        <Label className="mb-1 mt-4" htmlFor="opponent-address">Opponent Address</Label>
                        <Input id="opponent-address" value={secondPlayer} onChange={(e) => { setSecondPlayer(e.target.value) }} />
                        <Label className="mt-4 mb-1" htmlFor="stake-amount">Stake Amount(Eth)</Label>
                        <Input id="stake-amount" value={stakeAmount} onChange={(e) => { setStakeAmount(e.target.value) }} />
                        <Label className="mt-4 mb-1" htmlFor="salt">Salt (Remember this number to generate the final result)</Label>
                        <Input type="number" id="salt" value={salt} onChange={(e) => { setSalt(Number(e.target.value)) }} min={0} max={Number.MAX_SAFE_INTEGER} />
                        <Button
                            className="mt-2"
                            onClick={handleDeploy}
                            disabled={isPending || isConfirming}
                        >
                            {isPending ? "Deploying..." : "Deploy Contract"}
                        </Button>
                    </>
                )
            }

            {
                hash && (
                    <div>
                        <p>Transaction Hash:
                            <a
                                href={`https://sepolia.etherscan.io/tx/${hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {hash}
                            </a>
                        </p>
                        {
                            contractAddress && (
                                <p>Contract Address:
                                    <a
                                        href={`https://sepolia.etherscan.io/address/${contractAddress}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {contractAddress}
                                    </a>
                                </p>
                            )
                        }
                        {isConfirming && <p>Waiting for confirmation...</p>}
                        {isSuccess && <><p>Contract deployed successfully! Copy the url and share with your opponent to play</p>
                            <CopyButton text={`/bet/${contractAddress}`} label="Copy address" />
                            <Link to={`${window.location.origin}/result/${contractAddress}`} className="text-blue-500">Result Page</Link>
                        </>}
                    </div>
                )
            }
        </div>
    )
}
