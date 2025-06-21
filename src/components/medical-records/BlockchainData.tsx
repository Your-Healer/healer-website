"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RefreshCw, Database, Link2, Clock, Hash, Activity, Wifi, WifiOff } from "lucide-react"
import { toast } from "sonner"
import {
    polkadotConnection,
    blockService,
    transactionService,
    type BlockData,
    type TransactionData
} from "@/lib/blockchain"

export default function BlockchainData() {
    const [isConnected, setIsConnected] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [lastBlocks, setLastBlocks] = useState<BlockData[]>([])
    const [lastTransactions, setLastTransactions] = useState<TransactionData[]>([])
    const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected" | "error">("disconnected")
    const [chainInfo, setChainInfo] = useState<any>(null)
    const [realTimeUpdates, setRealTimeUpdates] = useState(false)

    // Subscription cleanup functions
    const [blockSubscription, setBlockSubscription] = useState<(() => void) | null>(null)
    const [transactionSubscription, setTransactionSubscription] = useState<(() => void) | null>(null)

    // Real blockchain connection using Polkadot API
    const connectToBlockchain = async () => {
        setIsLoading(true)
        setConnectionStatus("connecting")

        try {
            await polkadotConnection.connect()
            const info = await polkadotConnection.getChainInfo()

            setChainInfo(info)
            setIsConnected(true)
            setConnectionStatus("connected")

            toast.success(`Kết nối thành công đến ${info.chain}`)

            // Fetch initial data
            await fetchLatestData()

        } catch (error: any) {
            setConnectionStatus("error")
            console.error('Blockchain connection error:', error)
            toast.error(`Lỗi kết nối blockchain: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchLatestData = async () => {
        if (!isConnected) return

        setIsLoading(true)
        try {
            const [blocks, transactions] = await Promise.all([
                blockService.getLatestBlocks(10),
                transactionService.getLatestTransactions(15)
            ])

            setLastBlocks(blocks)
            setLastTransactions(transactions)

        } catch (error: any) {
            console.error('Error fetching blockchain data:', error)
            toast.error(`Lỗi khi lấy dữ liệu: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    const toggleRealTimeUpdates = () => {
        if (realTimeUpdates) {
            // Stop real-time updates
            if (blockSubscription) {
                blockSubscription()
                setBlockSubscription(null)
            }
            if (transactionSubscription) {
                transactionSubscription()
                setTransactionSubscription(null)
            }
            setRealTimeUpdates(false)
            toast.info("Đã tắt cập nhật thời gian thực")
        } else {
            // Start real-time updates
            try {
                const blockUnsub = blockService.subscribeToNewBlocks((newBlock) => {
                    setLastBlocks(prev => [newBlock, ...prev.slice(0, 9)])
                    toast.success(`Block mới: #${newBlock.blockNumber}`)
                })

                const txUnsub = transactionService.subscribeToNewTransactions((newTx) => {
                    setLastTransactions(prev => [newTx, ...prev.slice(0, 14)])
                    toast.success(`Giao dịch mới: ${newTx.method}`)
                })

                setBlockSubscription(() => blockUnsub)
                setTransactionSubscription(() => txUnsub)
                setRealTimeUpdates(true)
                toast.success("Đã bật cập nhật thời gian thực")
            } catch (error: any) {
                toast.error(`Lỗi khi bật cập nhật thời gian thực: ${error.message}`)
            }
        }
    }

    const disconnectFromBlockchain = async () => {
        try {
            // Stop subscriptions
            if (blockSubscription) {
                blockSubscription()
                setBlockSubscription(null)
            }
            if (transactionSubscription) {
                transactionSubscription()
                setTransactionSubscription(null)
            }

            await polkadotConnection.disconnect()

            setIsConnected(false)
            setConnectionStatus("disconnected")
            setRealTimeUpdates(false)
            setLastBlocks([])
            setLastTransactions([])
            setChainInfo(null)

            toast.info("Đã ngắt kết nối blockchain")
        } catch (error: any) {
            toast.error(`Lỗi khi ngắt kết nối: ${error.message}`)
        }
    }

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            if (blockSubscription) blockSubscription()
            if (transactionSubscription) transactionSubscription()
        }
    }, [blockSubscription, transactionSubscription])

    const formatHash = (hash: string) => {
        return `${hash.slice(0, 8)}...${hash.slice(-8)}`
    }

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString("vi-VN")
    }

    const getMethodDisplayName = (method: string) => {
        const methodMap: { [key: string]: string } = {
            'addMedicalRecord': 'Thêm hồ sơ',
            'updateMedicalRecord': 'Cập nhật hồ sơ',
            'deleteMedicalRecord': 'Xóa hồ sơ',
            'transfer': 'Chuyển khoản',
            'balanceTransfer': 'Chuyển số dư'
        }
        return methodMap[method] || method
    }

    return (
        <div className="space-y-6">
            {/* Connection Status */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                Kết Nối Healer Network
                                {realTimeUpdates && (
                                    <Badge variant="default" className="ml-2">
                                        <Wifi className="h-3 w-3 mr-1" />
                                        Live
                                    </Badge>
                                )}
                            </CardTitle>
                            <CardDescription>
                                Kết nối đến mạng Healer để truy xuất dữ liệu blockchain
                                {chainInfo && (
                                    <span className="block mt-1 text-sm">
                                        {chainInfo.chain} - {chainInfo.nodeName} v{chainInfo.nodeVersion}
                                    </span>
                                )}
                            </CardDescription>
                        </div>
                        <Badge variant={
                            connectionStatus === "connected" ? "default" :
                                connectionStatus === "connecting" ? "secondary" :
                                    connectionStatus === "error" ? "destructive" : "outline"
                        }>
                            {connectionStatus === "connected" ? "Đã kết nối" :
                                connectionStatus === "connecting" ? "Đang kết nối..." :
                                    connectionStatus === "error" ? "Lỗi kết nối" : "Chưa kết nối"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3 flex-wrap">
                        {!isConnected ? (
                            <Button onClick={connectToBlockchain} disabled={isLoading}>
                                <Link2 className="h-4 w-4 mr-2" />
                                {isLoading ? "Đang kết nối..." : "Kết nối Healer Network"}
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" onClick={fetchLatestData} disabled={isLoading}>
                                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                                    Làm mới dữ liệu
                                </Button>
                                <Button
                                    variant={realTimeUpdates ? "default" : "outline"}
                                    onClick={toggleRealTimeUpdates}
                                >
                                    {realTimeUpdates ? (
                                        <>
                                            <WifiOff className="h-4 w-4 mr-2" />
                                            Tắt cập nhật live
                                        </>
                                    ) : (
                                        <>
                                            <Wifi className="h-4 w-4 mr-2" />
                                            Bật cập nhật live
                                        </>
                                    )}
                                </Button>
                                <Button variant="outline" onClick={disconnectFromBlockchain}>
                                    Ngắt kết nối
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {isConnected && (
                <>
                    {/* Latest Blocks */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Blocks Gần Nhất
                                <Badge variant="outline">{lastBlocks.length} blocks</Badge>
                            </CardTitle>
                            <CardDescription>
                                Danh sách các block mới nhất trên Healer Network
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Block Number</TableHead>
                                        <TableHead>Block Hash</TableHead>
                                        <TableHead>Transactions</TableHead>
                                        <TableHead>Timestamp</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lastBlocks.map((block) => (
                                        <TableRow key={block.blockNumber}>
                                            <TableCell className="font-mono">#{block.blockNumber}</TableCell>
                                            <TableCell className="font-mono text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Hash className="h-3 w-3" />
                                                    {formatHash(block.blockHash)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{block.transactionCount} txs</Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatTimestamp(block.timestamp)}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Latest Transactions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <RefreshCw className="h-5 w-5" />
                                Transactions Gần Nhất
                                <Badge variant="outline">{lastTransactions.length} txs</Badge>
                            </CardTitle>
                            <CardDescription>
                                Danh sách các giao dịch liên quan đến hồ sơ bệnh án
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Transaction Hash</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Block</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Timestamp</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lastTransactions.map((tx) => (
                                        <TableRow key={tx.txHash}>
                                            <TableCell className="font-mono text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Hash className="h-3 w-3" />
                                                    {formatHash(tx.txHash)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{getMethodDisplayName(tx.method)}</p>
                                                    <p className="text-xs text-gray-500">{tx.section}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono">#{tx.blockNumber}</TableCell>
                                            <TableCell>
                                                <Badge variant={tx.status === "success" ? "default" : "destructive"}>
                                                    {tx.status === "success" ? "Thành công" : "Thất bại"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatTimestamp(tx.timestamp)}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </>
            )}

            {!isConnected && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Database className="h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa kết nối Healer Network</h3>
                        <p className="text-gray-500 text-center mb-4">
                            Kết nối đến mạng Healer để xem dữ liệu blocks và transactions thời gian thực
                        </p>
                        <Button onClick={connectToBlockchain} disabled={isLoading}>
                            <Link2 className="h-4 w-4 mr-2" />
                            Kết nối ngay
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
