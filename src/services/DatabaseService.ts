const OrbitDB = require('orbit-db')
const IPFS = require('ipfs')

export class LocalOrbitDatabase {
    _ipfs_instance: any = undefined
    _orbit_db_instance: any = undefined
    _database: any = undefined
    _database_prefix: string = 'orbit'
    _database_cid = undefined
    _database_name: string | undefined = undefined
    _isBuilt: boolean = false
    _database_options = {
        accessController: {
            write: ['*']
        }
    }

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
        await this._database.load()
        this.StartListeners()
        this._isBuilt = true
    }

    CreateDatabase = async () => {
        this._database = await this._orbit_db_instance.docstore(this._database_name, this._database_options)
        this._database_cid = this._database.address.toString()
        console.log('Database CID', this._database_cid, this._database)
        return this._database
    }

    StartListeners = async () => {
        this._database.events.on('replicated', (address: string) => {
            console.log('Database replicated', address)
        })
    }

    getIdentity: () => Identity = () => {
        return this._database.identity
    }
}

interface Identity {
    _id: string,
    _provider: any,
    _publicKey: string,
    _signatures: any,
    _type: string,
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
