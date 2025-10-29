import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { config } from "./wallet/config"
import { WalletOptions } from "./wallet/WalletOptions"

function App() {
    const queryClient = new QueryClient()

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <WalletOptions />
            </QueryClientProvider>
        </WagmiProvider>
    )
}

export default App
