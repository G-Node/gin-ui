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

window.randdir = randDirs()

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

    listShared(username, viewer) {
        return new Promise((resolve) => {
            const publicOnly = username !== viewer
            const found = Array.from(data.repos.entries())
                .map((entry) => { return copyRepo(entry[1], entry[0]) })
                .filter((repo) => {
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
            const found = Array.from(data.repos.entries())
                .map((entry) => { return copyRepo(entry[1], entry[0]) })
                .filter((repo) => {
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
            const fullName = [username, repository].join("/")
            const repo = data.repos.get(fullName)

            if (repo && (publicOnly ? repo.public : true)) {
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

    getDir(username, repository, path, viewer) {
        return new Promise((resolve, reject) => {
            const publicOnly = username !== viewer
            const fullName = [username, repository].join("/")
            const repo = data.repos.get(fullName)

            if (repo && (publicOnly ? repo.public : true)) {
                const pathComp = path ? path.split("/") : []
                const [dir, p] = lastDir(null, repo.root, pathComp)

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

    getFile(username, repository, path, viewer) {
        return new Promise((resolve, reject) => {
            const publicOnly = username !== viewer
            const fullName = [username, repository].join("/")
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
