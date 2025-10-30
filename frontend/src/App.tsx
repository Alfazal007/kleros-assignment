import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { WalletOptions } from "./components/custom/wallet/WalletOptions"
import { config } from "./components/custom/wallet/config"
import DeployContract from "./components/custom/deploy/Deploy"
import { Toaster } from "sonner"

function App() {
    const queryClient = new QueryClient()

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <WalletOptions />
                <DeployContract />
                <Toaster />
            </QueryClientProvider>
        </WagmiProvider>
    )
}

export default App
