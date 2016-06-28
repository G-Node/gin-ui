function mapOf(obj) {
    const map = new Map()
    for (let k of Object.keys(obj)) {
        map.set(k, obj[k])
    }
    return map
}

function randInt(min, max) {
    return (Math.floor(Math.random() * (max - min + 1)) + min)
}

function randElem(array) {
    switch(array.length) {
    case 0:
        return null
    case 1:
        return array[0]
    default:
        return array[randInt(0, array.length - 1)]
    }
}

function randStr(length) {
    let letters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]
    let res = ""
    for (let i = 0; i < length; i++) {
        res = res + randElem(letters)
    }
    return res
}

function randDirs() {
    const max_depth = 4
    const max_files = 10
    const max_size  = 1024 * 1024 * 1024
    const max_dirs  = 5
    const prefixes = ["monkey", "mouse", "fish", "patient"]
    const suffixes = ["data", "metadata", "info", "recording"]
    const extensions = [".odml", ".h5", ".xml", ".yml", ".json", ".nix"]

    function mkFiles(dir, prefix) {
        const ext = randElem(extensions)

        for (let i = 0; i < randInt(1, max_files); i++) {
            let file_name = prefix + i + ext
            dir.files[file_name] = {
                type: "file",
                name: file_name,
                size: randInt(1, max_size)
            }
        }
    }

    function mkDirs(dir, name, depth) {
        dir.name  = name
        dir.type  = "dir"
        dir.files = {}

        if (depth > 0) {
            for (let i = 0; i < randInt(1, max_dirs); i++) {
                let dir_name = randElem(prefixes) + "-" + randElem(suffixes)
                dir.files[dir_name] = mkDirs({}, dir_name, depth - 1)
            }
        }

        mkFiles(dir, name)

        dir.size = Object.keys(dir.files).length
        
        return dir
    }

    const root = mkDirs({}, randElem(prefixes) + "-" + randElem(suffixes), max_depth)
    root.name = ":root"

    return root
}

const data = {
    accounts: mapOf({
        "bob": {
            password: "testtest",
            email: "bob@example.com",
            title: "Dr.",
            first_name: "Bob",
            last_name: "Baker"
        },
        "alice": {
            password: "testtest",
            email: null,
            title: "Mrs.",
            first_name: "Alice",
            last_name: "Goodchild"
        },
        "john": {
            password: "testtest",
            email: "jj@example.com",
            title: "Mr.",
            first_name: "John",
            last_name: "Josephson"
        }
    }),

    keys: mapOf({
        "bob": [
            {
                fingerprint: "x9nS_Siw6cUy0qemb10V0dSK8YQYS2BKvV5KFowitUw",
                description: "Bobs work key"
            }
        ],
        "alice": [
            {
                fingerprint: "YiyshecHIHhJo5gP2gl/0zfdutuWYob+1lbdFdCqIUw",
                description: "Alice work key"
            },
            {
                fingerprint: "A3tkBXFQWkjU6rzhkofY55G7tPR_Lmna4B-WEGVFXOQ",
                description: "Alice home key"
            }
        ],
        "john": [
            {
                fingerprint: "+2gCRHNg0LSAs3xhk+UYpZ33UFUj9GKK5C/i2LQp0fA",
                description: "This is my only key"
            }
        ]
    }),

    repos: mapOf({
        "john/johns-public-data": {
            description: "This is the repository description",
            shared: ["alice"],
            public: true,
            root: randDirs()
        },
        "john/johns-private-data": {
            description: "This is the repository description",
            shared: [],
            public: false,
            root: randDirs()
        },
        "alice/alice-public-data": {
            description: "This is the repository description",
            shared: ["bob"],
            public: true,
            root: randDirs()
        },
        "alice/alice-supplemental-data": {
            description: "This is the repository description",
            shared: [],
            public: true,
            root: randDirs()
        },
        "alice/my-private-data": {
            description: "This is the repository description",
            shared: [],
            public: false,
            root: randDirs()
        },
        "bob/bobs-data": {
            description: "This is the repository description",
            shared: ["alice", "john"],
            public: true,
            root: randDirs()
        }
    })
}

export default class API {

    constructor(auth_url, repo_url) {
        this.config   = { auth_url: auth_url, repo_url: repo_url, token: null }
        this.accounts = new AccountAPI(this.config)
        this.keys     = new SSHKeyAPI(this.config)
        this.repos    = new RepoAPI(this.config)
        this.files    = new FileAPI(this.config)
    }

    authorize() {
        const url = this.config.auth_url + "/oauth/authorize?"
        const params = [
            ["response_type", "token"],
            ["client_id", "gin"],
            ["redirect_uri", `${window.location.origin}/oauth/login`],
            ["scope", "account-read account-write repo-read repo-write"],
            ["state", "foo"]
        ]
        const query = params.map((p) => encodeURIComponent(p[0]) + "=" + encodeURIComponent(p[1])).join("&")
        window.location.replace(url + query)
    }
    
    login(token_str) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.config.auth_url}/oauth/validate/${token_str}`,
                type: "GET",
                dataType: "json",
                success: (token) => {
                    this.config.token = token
                    resolve(token)
                },
                error: (error) => {
                    this.logout()
                    reject(error)
                }
            })
        }).then(
            (token) => {
                return this.accounts.get(token.login)   
            }
        )
    }

    logout() {
        this.config.token = null
    }
}

function copyAccount(account, login_name) {
    const copy = Object.assign({login: login_name}, account)
    delete copy.password
    return copy
}

class AccountAPI {
    
    constructor(config) {
        this.config = config
    }

    get(username) {
        return new Promise((resolve, reject) => {
            const request = {
                url: `${this.config.auth_url}/api/accounts/${username}`,
                type: "GET",
                dataType: "json",
                success: (acc) => resolve(acc),
                error: (error) => reject(error)
            }
            if (this.config.token) {
                request.headers = { Authorization: `Bearer ${this.config.token.jti}` }
            }
            $.ajax(request)
        })
    }

    search(text) {
        let result = []
        return new Promise((resolve, reject) => {
            if (text && text.length >= 1) {
                result = Array.from(data.accounts.entries())
                    .filter((entry) => entry[0].indexOf(text) >= 0)
                    .map((entry) => copyAccount(entry[1], entry[0]))
            }
            resolve(result)
        })
    }

    update(account) {
        return new Promise((resolve, reject) => {
            let acc = data.accounts.get(account.login)
            if (acc) {
                acc = Object.assign(acc, account)
                delete acc.login
                data.accounts.set(account.login, acc)
                resolve(account)
            } else {
                reject(Error("Account does not exist"))
            }
        })
    }
    
    updatePassword(username, old_password, new_password, repeated_password) {
        return new Promise((resolve, reject) => {
            const acc = data.accounts.get(username)
            if (acc) {
                if (acc.password !== old_password) {
                    reject(Error("Old password does not match"))
                } else if (new_password !== repeated_password) {
                    reject(Error("Repeated password does not match"))
                } else {
                    acc.password = new_password
                    resolve(copyAccount(acc, username))
                }
            } else {
                reject(Error("Account does not exist"))
            }
        })
    }
}

function copyKey(username, key) {
    return Object.assign({ login: username }, key)
}

class SSHKeyAPI {

    constructor(config) {
        this.config = config
    }
    
    list(username) {
        return new Promise((resolve, reject) => {
            const keys = data.keys.get(username)
            if (keys) {
                resolve(keys.map((key) => copyKey(username, key)))
            } else {
                reject(Error("Account does not exist"))
            }
        })
    }

    get(username, fingerprint) {
        return new Promise((resolve, reject) => {
            const keys = data.keys.get(username)
            if (keys) {
                const keyFound = keys.find((k) => k.fingerprint === fingerprint)
                if (keyFound) {
                    resolve(copyKey(username, keyFound))
                } else {
                    reject(Error("Key does not exist"))
                }
            } else {
                reject(Error("Account does not exist"))
            }
        })
    }

    create(username, key) {
        return new Promise((resolve, reject) => {
            let keys = data.keys.get(username)
            if (key.description === null || key.description === "") {
                reject(Error("Key description is missing"))
            }
            else if (key.key === null || key.key === "") {
                reject(Error("Public key is missing"))
            }
            else {
                key.fingerprint = randStr(20)
                if (keys) {
                    const key_found = keys.find((k) => k.fingerprint === key.fingerprint)
                    if (!key_found) {
                        keys = keys.concat({fingerprint: key.fingerprint, description: key.description})
                        data.keys.set(username, keys)
                        resolve(copyKey(username, key))
                    } else {
                        reject(Error("Key already exists"))
                    }
                } else {
                    reject(Error("Account does not exist"))
                }
            }
        })
    }

    update(key) {
        return new Promise((resolve, reject) => {
            const keys = data.keys.get(key.login)
            if (keys) {
                const key_found = keys.find((k) => k.fingerprint === key.fingerprint)
                if (key_found) {
                    key_found.fingerprint = key.fingerprint
                    key_found.description = key.description
                    resolve(copyKey(key.login, key_found))
                } else {
                    reject(Error("Key does not exist"))
                }
            } else {
                reject(Error("Account does not exist"))
            }
        })
    }

    remove(key) {
        return new Promise((resolve, reject) => {
            const keys = data.keys.get(key.login)
            if (keys) {
                const new_keys = keys.filter((k) => k.fingerprint !== key.fingerprint)
                if (new_keys.length < keys.length) {
                    data.keys.set(key.login, new_keys)
                    resolve(copyKey(key.login, key))
                } else {
                    reject(Error("Key does not exist"))
                }
            } else {
                reject(Error("Account does not exist"))
            }
        })
    }
}

function copyRepo(repo, full_name) {
    const [owner, name] = full_name.split("/")
    const copy = Object.assign({ owner: owner, name: name }, repo)
    delete copy.root
    return copy
}

class RepoAPI {

    constructor(config) {
        this.config = config
    }

    listPublic(search_text=null) {
        const search_lower = search_text ? search_text.toLowerCase() : ""
        return new Promise((resolve) => {
            const found = Array.from(data.repos.entries())
                .map((entry) => { return copyRepo(entry[1], entry[0]) })
                .filter((repo) => {
                    const all = (repo.name + repo.description + repo.owner).toLowerCase()
                    return repo.public && (all.search(search_lower) >= 0)
                })
            resolve(found)
        })
    }

    listShared(username, login_name) {
        return new Promise((resolve) => {
            const public_only = username !== login_name
            const found = Array.from(data.repos.entries())
                .map((entry) => { return copyRepo(entry[1], entry[0]) })
                .filter((repo) => {
                    const is_owner  = repo.owner === username
                    const is_shared = repo.shared.find((name) => {return name === username})
                    const is_public = repo.public

                    return !is_owner && is_shared && (public_only ? is_public : true)
                })
            resolve(found)
        })
    }

    listOwn(username, login_name) {
        return new Promise((resolve) => {
            const public_only = username !== login_name
            const found = Array.from(data.repos.entries())
                .map((entry) => { return copyRepo(entry[1], entry[0]) })
                .filter((repo) => {
                    const is_owner  = repo.owner === username
                    const is_public = repo.public

                    return is_owner && (public_only ? is_public : true)
                })
            resolve(found)
        })
    }
    
    get(username, repo_name, login_name) {
        return new Promise((resolve, reject) => {
            const public_only = username !== login_name
            const full_name = [username, repo_name].join("/")
            const repo = data.repos.get(full_name)

            if (repo && (public_only ? repo.public : true)) {
                resolve(copyRepo(repo, full_name))
            } else {
                reject(Error("Repository does not exist"))
            }
        })
    }

    create(username, repository) {
        const full_name = [username, repository.name].join("/")

        return new Promise((resolve, reject) => {
            let name = repository.name || ""
            if (!name.match(/^[a-zA-Z0-9_\-]*$/)) {
                reject(Error("Repository name must only contain alphanumeric characters"))
                return
            }

            if (name.length < 2 || name.length > 20) {
                reject(Error("Repository name must be between 2 and 20 characters long"))
                return
            }

            if (!data.accounts.has(username)) {
                reject(Error("Account does not exist"))
                return
            }

            if (data.repos.has(full_name)) {
                reject(Error("Repository already exists"))
                return
            }

            delete repository.name
            repository.shared = []
            repository.root = randDirs()

            data.repos.set(full_name, repository)
            resolve(copyRepo(repository, full_name))
        })
    }


    update(repository) {
        const full_name = [repository.owner, repository.name].join("/")

        return new Promise((resolve, reject) => {
            const repo = data.repos.get(full_name)

            if (repo) {
                repo.description = repository.description
                repo.shared = repository.shared
                repo.public = repository.public

                resolve(copyRepo(repo, full_name))
            } else {
                reject(Error("Repository does not exist"))
            }
        })
    }

    remove(repository) {
        const full_name = [repository.owner, repository.name].join("/")

        return new Promise((resolve, reject) => {
            const repo = data.repos.get(full_name)

            if (repo) {
                data.repos.delete(full_name)
                resolve(copyRepo(repo, full_name))
            } else {
                reject(Error("Repository does not exist"))
            }
        })
    }
}

function lastDir(parent, dir, path) {
    if (path.length === 0) {
        if (dir.type === "dir") {
            return [dir, path]
        } else if (parent && parent.type === "dir") {
            return [parent, [dir.name]]
        } else {
            return [null, path]
        }
    } else {
        const sub_name = path[0]
        if (dir.files.hasOwnProperty(sub_name)) {
            return lastDir(dir, dir.files[sub_name], path.slice(1))
        } else {
            return [null, path]
        }
    }
}

function copyFile(file) {
    const copy = Object.assign({}, file)

    if (file.type === "dir") {
        copy.files = {}
        for (let name of Object.keys(file.files)) {
            let copy_sub = Object.assign({}, file.files[name])
            delete copy_sub.files
            copy.files[name] = copy_sub
        }
    }

    return copy
}

class FileAPI {

    constructor(config) {
        this.config = config
    }

    getDir(username, repo_name, path, login_name) {
        return new Promise((resolve, reject) => {
            const public_only = username !== login_name
            const full_name = [username, repo_name].join("/")
            const repo = data.repos.get(full_name)

            if (repo && (public_only ? repo.public : true)) {
                const path_components = path ? path.split("/") : []
                let [dir, _p] = lastDir(null, repo.root, path_components)

                if (dir) {
                    resolve(copyFile(dir))
                } else {
                    reject(Error("File does not exist"))
                }
            } else {
                reject(Error("Repository does not exist"))
            }
        })
    }

    getFile(username, repo_name, path, login_name) {
        return new Promise((resolve, reject) => {
            const public_only = username !== login_name
            const full_name = [username, repo_name].join("/")
            const repo = data.repos.get(full_name)

            if (repo && (public_only ? repo.public : true)) {
                const path_components = path ? path.split("/") : []
                const [dir, p] = lastDir(null, repo.root, path_components)

                if (dir && dir.file.hasOwnProperty(p[0])) {
                    resolve(copyFile(dir[p[0]]))
                } else {
                    reject(Error("File does not exist"))
                }
            } else {
                reject(Error("Repository does not exist"))
            }
        })
    }

}
