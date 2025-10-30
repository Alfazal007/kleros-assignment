import { Button } from '@/components/ui/button'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function WalletOptions() {
    const { connectors, connect } = useConnect()
    const { isConnected, address } = useAccount()
    const { disconnect } = useDisconnect()

    if (isConnected && address) {
        return <Address address={address} onDisconnect={disconnect} />
    } else {
        return connectors.filter(c => c.name == "MetaMask").
            map((connector) => (
                <Button key={connector.uid} onClick={() => connect({ connector })}>
                    Connect
                </Button >
            ))
    }
}

function Address({ address, onDisconnect }: { address: `0x${string}`, onDisconnect: () => void }) {
    const truncateAddress = (addr: string) => {
        return addr.slice(0, 6) + '...' + addr.slice(-4)
    }
    return (
        <Button onClick={onDisconnect}>
            {truncateAddress(address)}
        </Button >
    )
}
