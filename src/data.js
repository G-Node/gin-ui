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

function genDirs() {
    const maxDepth = 4,
          maxFiles = 10,
          maxSize  = 1024 * 1024 * 1024,
          maxDirs  = 5,
          prefixes = ["monkey", "mouse", "fish", "patient"],
          suffixes = ["data", "metadata", "info", "recording"],
          extensions = [".odml", ".h5", ".xml", ".yml", ".json", ".nix"]

    function mkFiles(dir, prefix) {
        const ext = randElem(extensions)

        for (let i = 0; i < randInt(1, maxFiles); i++) {
            let name = prefix + i + ext
            dir[name] = {
                type: "file",
                ext: ext,
                name: name,
                size: randInt(1, maxSize)
            }
        }
    }

    function mkDirs(dir, name, depth) {
        if (depth > 0) {
            for (let i = 0; i < randInt(1, maxDirs); i++) {
                let childName = randElem(prefixes) + "-" + randElem(suffixes)
                dir[childName] = mkDirs({}, childName, depth - 1)
            }
        }

        dir["name"] = name
        dir["type"] = "dir"

        mkFiles(dir, name)
        return dir
    }

    return mkDirs({}, randElem(prefixes) + "-" + randElem(suffixes), maxDepth)
}

var data = {
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
    repos: [
        {
            name: "johns-public-data",
            description: "This is the repository description",
            owner: "john",
            shared: ["alice"],
            public: true,
            files: genDirs()
        },
        {
            name: "johns-private-data",
            description: "This is the repository description",
            owner: "john",
            shared: [],
            public: false,
            files: genDirs()
        },
        {
            name: "alice-public-data",
            description: "This is the repository description",
            owner: "alice",
            shared: ["bob"],
            public: true,
            files: genDirs()
        },
        {
            name: "alice-supplemental-data",
            description: "This is the repository description",
            owner: "alice",
            shared: [],
            public: true,
            files: genDirs()
        },
        {
            name: "my-private-data",
            description: "This is the repository description",
            owner: "alice",
            shared: [],
            public: false,
            files: genDirs()
        },
        {
            name: "bobs-data",
            description: "This is the repository description",
            owner: "bob",
            shared: ["alice", "john"],
            public: true,
            files: genDirs()
        }
    ]
}

function copyAccount(account, username) {
    const copy = Object.assign({username: username}, account)
    delete copy.password
    return copy
}

export class AccountAPI {

    login(username, password) {
        return new Promise((resolve, reject) => {
            let acc = data.accounts.get(username)
            if (acc && acc.password === password) {
                resolve(copyAccount(acc, username))
            } else {
                reject(Error("Invalid user name or password"))
            }
        })
    }

    get(username) {
        return new Promise((resolve, reject) => {
            let acc = data.accounts.get(username)
            if (acc) {
                resolve(copyAccount(acc, username))
            } else {
                reject(Error("Account does not exist"))
            }
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
            let acc = data.accounts.get(username)
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

export class RepoAPI {

    listPublic(searchText=null) {
        const searchLower = searchText ? searchText.toLowerCase() : ""
        return new Promise((resolve) => {
            const found = data.repos.filter((repo) => {
                const all = (repo.name + repo.description + repo.owner).toLowerCase()
                return repo.public && (all.search(searchLower) >= 0)
            })
            resolve(found)
        })
    }

    listShared(username, viewer) {
        return new Promise((resolve) => {
            const publicOnly = username !== viewer
            const found = data.repos.filter((repo) => {
                const isOwner  = repo.owner === username,
                      isShared = repo.shared.find((name) => {return name === username}),
                      isPublic = repo.public

                return !isOwner && isShared && (publicOnly ? isPublic : true)
            })
            resolve(found)
        })
    }

    listOwn(username, viewer) {
        return new Promise((resolve) => {
            const publicOnly = username !== viewer
            const found = data.repos.filter((repo) => {
                const isOwner  = repo.owner === username,
                      isPublic = repo.public

                return isOwner && (publicOnly ? isPublic : true)
            })
            resolve(found)
        })
    }
    
    get(username, repository, viewer) {
        return new Promise((resolve, reject) => {
            const publicOnly = username !== viewer
            const found = data.repos.find((repo) => {
                const isOwner  = repo.owner === username,
                      isPublic = repo.public

                return isOwner && (publicOnly ? isPublic : true) && repo.owner === username && repo.name === repository
            })
            if (found) {
                resolve(found)
            } else {
                reject(Error("Repository does not exist"))
            }
        })
    }
}