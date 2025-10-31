import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { WalletOptions } from "./components/custom/wallet/WalletOptions"
import { config } from "./components/custom/wallet/config"
import DeployContract from "./components/custom/deploy/Deploy"
import { Toaster } from "sonner"
import { BrowserRouter, Route, Routes } from "react-router"
import BetPage from "./components/custom/secondPlayer/Bet"

function App() {
    const queryClient = new QueryClient()

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <WalletOptions />
                    <Routes>
                        <Route path="/" element={<DeployContract />} />
                        <Route path="/bet/:contractAddress" element={<BetPage />} />
                    </Routes>
                    <Toaster />
                </BrowserRouter>
            </QueryClientProvider>
        </WagmiProvider>
    )
}

export default App
