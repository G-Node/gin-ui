function mapOf(obj) {
    const map = new Map()
    for (let k in obj) {
        if (obj.hasOwnProperty(k)) {
            map.set(k, obj[k])
        }
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

function randDirs() {
    const maxDepth = 4
    const maxFiles = 10
    const maxSize  = 1024 * 1024 * 1024
    const maxDirs  = 5
    const prefixes = ["monkey", "mouse", "fish", "patient"]
    const suffixes = ["data", "metadata", "info", "recording"]
    const extensions = [".odml", ".h5", ".xml", ".yml", ".json", ".nix"]

    function mkFiles(dir, prefix) {
        const ext = randElem(extensions)

        for (let i = 0; i < randInt(1, maxFiles); i++) {
            let fileName = prefix + i + ext
            dir.files[fileName] = {
                type: "file",
                name: fileName,
                size: randInt(1, maxSize)
            }
        }
    }

    function mkDirs(dir, name, depth) {
        dir.name  = name
        dir.type  = "dir"
        dir.files = {}

        if (depth > 0) {
            for (let i = 0; i < randInt(1, maxDirs); i++) {
                let dirName = randElem(prefixes) + "-" + randElem(suffixes)
                dir.files[dirName] = mkDirs({}, dirName, depth - 1)
            }
        }

        mkFiles(dir, name)

        dir.size = Object.keys(dir.files).length
        
        return dir
    }

    const root = mkDirs({}, randElem(prefixes) + "-" + randElem(suffixes), maxDepth)
    root.name = ":root"

    return root
}

const data = {
    accounts: mapOf({
        "bob": {
            password: "testtest",
            email: "bob@example.com",
            title: "Dr.",
            firstName: "Bob",
            lastName: "Baker"
        },
        "alice": {
            password: "testtest",
            email: null,
            title: "Mrs.",
            firstName: "Alice",
            lastName: "Goodchild"
        },
        "john": {
            password: "testtest",
            email: "jj@example.com",
            title: "Mr.",
            firstName: "John",
            lastName: "Josephson"
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

function copyAccount(account, username) {
    const copy = Object.assign({username: username}, account)
    delete copy.password
    return copy
}

export class AccountAPI {

    login(username, password) {
        return new Promise((resolve, reject) => {
            const acc = data.accounts.get(username)
            if (acc && acc.password === password) {
                resolve(copyAccount(acc, username))
            } else {
                reject(Error("Invalid user name or password"))
            }
        })
    }

    get(username) {
        return new Promise((resolve, reject) => {
            const acc = data.accounts.get(username)
            if (acc) {
                resolve(copyAccount(acc, username))
            } else {
                reject(Error("Account does not exist"))
            }
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
            let acc = data.accounts.get(account.username)
            if (acc) {
                acc = Object.assign(acc, account)
                delete acc.username
                data.accounts.set(account.username, acc)
                resolve(account)
            } else {
                reject(Error("Account does not exist"))
            }
        })
    }
    
    updatePassword(username, oldPassword, newPassword, repeatedPassword) {
        return new Promise((resolve, reject) => {
            const acc = data.accounts.get(username)
            if (acc) {
                if (acc.password !== oldPassword) {
                    reject(Error("Old password does not match"))
                } else if (newPassword !== repeatedPassword) {
                    reject(Error("Repeated password does not match"))
                } else {
                    acc.password = newPassword
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

export class SSHKeyAPI {
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

    create(key) {
        return new Promise((resolve, reject) => {
            let keys = data.keys.get(key.login)
            if (keys) {
                const keyFound = keys.find((k) => k.fingerprint === key.fingerprint)
                if (!keyFound) {
                    keys = keys.concat({fingerprint: key.fingerprint, description: key.description})
                    data.keys.set(key.login, keys)
                    resolve(copyKey(key.login, key))
                } else {
                    reject(Error("Key already exists"))
                }
            } else {
                reject(Error("Account does not exist"))
            }
        })
    }

    update(key) {
        return new Promise((resolve, reject) => {
            const keys = data.keys.get(key.login)
            if (keys) {
                const keyFound = keys.find((k) => k.fingerprint === key.fingerprint)
                if (keyFound) {
                    keyFound.fingerprint = key.fingerprint
                    keyFound.description = key.description
                    resolve(copyKey(key.login, keyFound))
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
                const newKeys = keys.filter((k) => k.fingerprint !== key.fingerprint)
                if (newKeys.length < keys.length) {
                    data.keys.set(key.login, newKeys)
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

function copyRepo(repo, fullName) {
    const [owner, name] = fullName.split("/")
    const copy = Object.assign({ owner: owner, name: name }, repo)
    delete copy.root
    return copy
}

export class RepoAPI {

    listPublic(searchText=null) {
        const searchLower = searchText ? searchText.toLowerCase() : ""
        return new Promise((resolve) => {
            const found = Array.from(data.repos.entries())
                .map((entry) => { return copyRepo(entry[1], entry[0]) })
                .filter((repo) => {
                    const all = (repo.name + repo.description + repo.owner).toLowerCase()
                    return repo.public && (all.search(searchLower) >= 0)
                })
            resolve(found)
        })
    }

    listShared(username, loginName) {
        return new Promise((resolve) => {
            const publicOnly = username !== loginName
            const found = Array.from(data.repos.entries())
                .map((entry) => { return copyRepo(entry[1], entry[0]) })
                .filter((repo) => {
                    const isOwner  = repo.owner === username
                    const isShared = repo.shared.find((name) => {return name === username})
                    const isPublic = repo.public

                    return !isOwner && isShared && (publicOnly ? isPublic : true)
                })
            resolve(found)
        })
    }

    listOwn(username, loginName) {
        return new Promise((resolve) => {
            const publicOnly = username !== loginName
            const found = Array.from(data.repos.entries())
                .map((entry) => { return copyRepo(entry[1], entry[0]) })
                .filter((repo) => {
                    const isOwner  = repo.owner === username
                    const isPublic = repo.public

                    return isOwner && (publicOnly ? isPublic : true)
                })
            resolve(found)
        })
    }
    
    get(username, repoName, loginName) {
        return new Promise((resolve, reject) => {
            const publicOnly = username !== loginName
            const fullName = [username, repoName].join("/")
            const repo = data.repos.get(fullName)

            if (repo && (publicOnly ? repo.public : true)) {
                resolve(copyRepo(repo, fullName))
            } else {
                reject(Error("Repository does not exist"))
            }
        })
    }

    create(username, repository) {
        const fullName = [username, repository.name].join("/")

        return new Promise((resolve, reject) => {
            if (!repository.name.match(/^[a-zA-Z0-9_\-]{2,20}$/)) {
                reject(Error("Repository name must only contain alphanumeric characters"))
                return
            }

            if (!data.accounts.has(username)) {
                reject(Error("Account does not exist"))
                return
            }

            if (data.repos.has(fullName)) {
                reject(Error("Repository already exists"))
                return
            }

            delete repository.name
            repository.shared = []
            repository.root = randDirs()

            data.repos.set(fullName, repository)
            resolve(copyRepo(repository, fullName))
        })
    }


    update(repository) {
        const fullName = [repository.owner, repository.name].join("/")

        return new Promise((resolve, reject) => {
            const repo = data.repos.get(fullName)

            if (repo) {
                repo.description = repository.description
                repo.shared = repository.shared
                repo.public = repository.public

                resolve(copyRepo(repo, fullName))
            } else {
                reject(Error("Repository does not exist"))
            }
        })
    }

    remove(repository) {
        const fullName = [repository.owner, repository.name].join("/")

        return new Promise((resolve, reject) => {
            const repo = data.repos.get(fullName)

            if (repo) {
                data.repos.delete(fullName)
                resolve(copyRepo(repo, fullName))
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
        const subName = path[0]
        if (dir.files.hasOwnProperty(subName)) {
            return lastDir(dir, dir.files[subName], path.slice(1))
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
            if (file.files.hasOwnProperty(name)) {
                let copySub = Object.assign({}, file.files[name])
                delete copySub.files
                copy.files[name] = copySub
            }
        }
    }

    return copy
}

export class FileAPI {

    getDir(username, repoName, path, loginName) {
        return new Promise((resolve, reject) => {
            const publicOnly = username !== loginName
            const fullName = [username, repoName].join("/")
            const repo = data.repos.get(fullName)

            if (repo && (publicOnly ? repo.public : true)) {
                const pathComp = path ? path.split("/") : []
                let [dir, _p] = lastDir(null, repo.root, pathComp)

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

    getFile(username, repoName, path, loginName) {
        return new Promise((resolve, reject) => {
            const publicOnly = username !== loginName
            const fullName = [username, repoName].join("/")
            const repo = data.repos.get(fullName)

            if (repo && (publicOnly ? repo.public : true)) {
                const pathComp = path ? path.split("/") : []
                const [dir, p] = lastDir(null, repo.root, pathComp)

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
