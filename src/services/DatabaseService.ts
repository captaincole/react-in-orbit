const OrbitDB = require('orbit-db')
const IPFS = require('ipfs')

export class LocalOrbitDatabase {
    _ipfs_instance: any = undefined
    _orbit_db_instance: any = undefined
    _database: EventLogDB | undefined = undefined
    _database_prefix: string = 'orbit'
    _database_cid = undefined
    _database_name: string | undefined = undefined
    _isBuilt: boolean = false
    _database_options = {
        EXPERIMENTAL: {
            pubsub: true,
        },
        accessController: {
            write: ['*']
        }
    }
    _manifest_cid: string = ''

    constructor(name: string) {
        this._database_name = this._database_prefix + '.' + name
    }

    SendToOrbit = async () => {
        if (this._isBuilt) {
            return
        }
        console.log('Building OrbitDB database', this._database_name)
        const ipfsOptions: IPFSOptions = {
            repo: `./${this._database_name}`,
            config: {
                Addresses: {
                    Swarm: [
                        // Use IPFS dev webrtc signal server
                        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                        '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                        '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/',
                    ],
                },
            },
        };
        this._ipfs_instance = await IPFS.create(ipfsOptions)
        this._orbit_db_instance = await OrbitDB.createInstance(this._ipfs_instance)
        const address = await this._orbit_db_instance.determineAddress(this._database_name, 'docstore')
        console.log('Database address', address)
        await this.CreateDatabase()
        await this._database?.load()
        this.StartListeners()
        this._isBuilt = true
    }

    listenForReplication = (callback: (address: string) => void) => this._database?.events.on('replicated', callback)

    getNetworkPeers = async (): Promise<any[]> => {
        return await this._ipfs_instance?.swarm.peers()
    }

    getDatabasePeers = async (): Promise<any[]> => {
        return await this._ipfs_instance?.pubsub.peers(this._database?.address.toString())
    }

    CreateDatabase = async () => {
        // Create a new database with a new manifest
        if (this._manifest_cid === '') {
            this._database = await this._orbit_db_instance.eventlog(this._database_name, this._database_options)
        } else {
            // Connect to a currently hosted database
            this._database = await this._orbit_db_instance.eventlog(`/orbitdb/${this._manifest_cid}/${this._database_name}`, this._database_options)
        }
        this._database_cid = this._database?.address.toString()
        console.log('Database CID', this._database_cid, this._database)
        return this._database
    }

    StartListeners = async () => {
        this._database?.events.on('replicated', (address: string) => {
            console.log('Database replicated', address)
        })
    }

    getIdentity: () => IdentityProps = () => {
        if (!this._database) return {} as Identity
        return this._database.identity.toJSON()
    }
}

interface Identity extends IdentityProps {
    toJSON: () => IdentityProps
}

interface IdentityProps {
    id: string
    publicKey: string
    signatures: any
    type: string,
}

interface EventLogDB {
    identity: Identity,
    add: (entry: any) => Promise<string>,
    get: (hash: string) => ResultObj
    events: any
    address: any
    load: any
    iterator: (options: any) => any
}

interface ResultObj {
    payload: { value: any }
}

// Starting Types Here for informational purposes
interface IPFSOptions {
    repo: string // Path to IPFS repo, used by indexdb to store db information
    config: {
        Addresses: {
            Swarm: string[] // IPFS swarm peers, wrtc star instances are used by default
        }
    }
}
