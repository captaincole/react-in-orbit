import React, { useEffect } from "react";
import { UserSatalite } from "../../services/UserService";
export const Peers: React.FC = () => {
    const [networkPeers, setNetworkPeers] = React.useState(0)
    const [databasePeers, setDatabasePeers] = React.useState(0)


    useEffect(() => {
        const interval = setInterval(() => {
            console.log('Checking peers')
            const checkPeers = async () => {
                const network = await UserSatalite.getNetworkPeers()
                const database = await UserSatalite.getDatabasePeers()
                setNetworkPeers(network.length)
                setDatabasePeers(database.length)
                console.log('peers', network, database)
            }
            checkPeers()
        }, 10000)
        return () => clearInterval(interval)
    }, [])

    return <div>
        <div>Peers</div>
        <div>Network: {networkPeers}</div>
        <div>DB: {databasePeers}</div>
    </div>
}