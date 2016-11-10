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
    repos: mapOf({
        "john/johns-public-data": {
            description: "This is the repository description",
            shared: ["alice"],
            is_public: true,
            root: randDirs()
        },
        "john/johns-private-data": {
            description: "This is the repository description",
            shared: [],
            is_public: false,
            root: randDirs()
        },
        "alice/alice-public-data": {
            description: "This is the repository description",
            shared: ["bob"],
            is_public: true,
            root: randDirs()
        },
        "alice/alice-supplemental-data": {
            description: "This is the repository description",
            shared: [],
            is_public: true,
            root: randDirs()
        },
        "alice/my-private-data": {
            description: "This is the repository description",
            shared: [],
            is_public: false,
            root: randDirs()
        },
        "bob/bobs-data": {
            description: "This is the repository description",
            shared: ["alice", "john"],
            is_public: true,
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

    authorize(r) {
        const url = this.config.auth_url + "/oauth/authorize?"
        const params = [
            ["response_type", "token"],
            ["client_id", "gin"],
            ["redirect_uri", `${window.location.origin}/oauth/login`],
            ["scope", "account-read account-write repo-read repo-write"],
            ["state", "foo"]
        ]
        const query = params.map((p) => encodeURIComponent(p[0]) + "=" + encodeURIComponent(p[1])).join("&")
        window.location.href = url + query
        window.event.returnValue = false
    }

    login(token_str) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.config.auth_url}/oauth/validate/${token_str}`,
                type: "GET",
                dataType: "json",
                success: (token) => {
                    resolve(token)
                },
                error: (error) => {
                    reject(error.responseJSON)
                }
            })
        }).then(
            (token) => {
                this.config.token = token
                localStorage.setItem("token", JSON.stringify(token))
                return this.accounts.get(token.login)   
            }
        )
    }

    logout() {
        if (this.config.token) {
            const token = encodeURIComponent(this.config.token.jti)
            const redirect = encodeURIComponent(window.location.origin)
            const url = `${this.config.auth_url}/oauth/logout/${token}?redirect_uri=${redirect}`

            this.config.token = null
            localStorage.removeItem("token")

            window.location.href = url
            window.event.returnValue = false
        }
    }

    restore() {
        return new Promise((resolve, reject) => {
            let token = localStorage.getItem("token")
            if (!token) {
                reject(Error("No token in local storage"))
                return
            }
            token = JSON.parse(token)
            let expires = new Date(token.exp)
            if (expires < Date.now()) {
                reject(Error("Token was expired"))
                return
            }
            resolve(token)
        }).then((token) => {
            this.config.token = token
            return this.accounts.get(token.login)
        })
    }

    register() {
        window.location.href = `${this.config.auth_url}/oauth/registration_page`
        window.event.returnValue = false
    }
}

class AccountAPI {
    
    constructor(config) {
        this.config = config
    }

    get(username) {
        return new Promise((resolve, reject) => {
            const request = {
                url: `${this.config.auth_url}/api/accounts/${username}`,
                dataType: "json",
                success: (acc) => resolve(acc),
                error: (error) => reject(error.responseJSON)
            }
            if (this.config.token) {
                request.headers = { Authorization: `Bearer ${this.config.token.jti}` }
            }
            $.ajax(request)
        })
    }

    search(text) {
        return new Promise((resolve, reject) => {
            const request = {
                url: `${this.config.auth_url}/api/accounts`,
                data: {q: text},
                dataType: "json",
                success: (accounts) => resolve(accounts),
                error: (error) => reject(error.responseJSON)
            }
            if (this.config.token) {
                request.headers = { Authorization: `Bearer ${this.config.token.jti}` }
            }
            $.ajax(request)
        })
    }

    update(account) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.config.auth_url}/api/accounts/${account.login}`,
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                headers: { Authorization: `Bearer ${this.config.token.jti}`},
                data: JSON.stringify(account),
                dataType: "json",
                success: (acc) => resolve(acc),
                error: (error) => reject(error.responseJSON)
            })
        })
    }
    
    updatePassword(username, password_old, password_new, password_new_repeat) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.config.auth_url}/api/accounts/${username}/password`,
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                headers: { Authorization: `Bearer ${this.config.token.jti}`},
                data: JSON.stringify({password_old, password_new, password_new_repeat}),
                success: () => resolve("ok"),
                error: (error) => reject(error.responseJSON)
            })
        })
    }

    updateEmail(login, email, password) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.config.auth_url}/api/accounts/${login}/email`,
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                headers: {Authorization: `Bearer ${this.config.token.jti}`},
                data: JSON.stringify({password, email}),
                success: () => resolve("ok"),
                error: (error) => reject(error.responseJSON)
            })
        })
    }
}

class SSHKeyAPI {

    constructor(config) {
        this.config = config
    }
    
    list(username) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.config.auth_url}/api/accounts/${username}/keys`,
                headers: { Authorization: `Bearer ${this.config.token.jti}` },
                dataType: "json",
                success: (keys) => resolve(keys),
                error: (error) => reject(error.responseJSON)
            })
        })
    }

    create(username, key) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.config.auth_url}/api/accounts/${username}/keys`,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                headers: { Authorization: `Bearer ${this.config.token.jti}`},
                data: JSON.stringify(key),
                dataType: "json",
                success: (key) => resolve(key),
                error: (error) => reject(error.responseJSON)
            })
        })
    }

    remove(key) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.config.auth_url}/api/keys?fingerprint=${encodeURIComponent(key.fingerprint)}`,
                type: "DELETE",
                headers: { Authorization: `Bearer ${this.config.token.jti}` },
                dataType: "json",
                success: (key) => resolve(key),
                error: (error) => reject(error.responseJSON)
            })
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

    filterRepos(search_text=null, repos) {
        const search_lower = search_text ? search_text.toLowerCase() : ""
        return new Promise((resolve) => {
            const curr_data = Array.from(repos)
                .filter((repo) => {
                    const all = (repo.Name + repo.Description + repo.Owner).toLowerCase()
                    return all.search(search_lower) >= 0
                })
            resolve(curr_data)
        })
    }

    listPublic() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.config.repo_url}/repos/public`,
                type: "GET",
                dataType: "json",
                success: (json) => resolve(json),
                error: (error) => reject(error.responseJSON)
            })
        })
    }

    listShared() {
        return new Promise((resolve, reject) => {
            let req = {
                url: `${this.config.repo_url}/repos/shared`,
                type: "GET",
                dataType: "json",
                success: (json) => resolve(json),
                error: (error) => reject(error.responseJSON)
            }

            if (this.config.token) {
                req["headers"] = { Authorization: `Bearer ${this.config.token.jti}` }
            }

            $.ajax(req)
        })
    }

    listUserRepos(username) {
        return new Promise((resolve, reject) => {
            let req = {
                url: `${this.config.repo_url}/users/${username}/repos`,
                type: "GET",
                dataType: "json",
                success: (json) => resolve(json),
                error: (error) => reject(error.responseJSON)
            }

            if (this.config.token) {
                req["headers"] = { Authorization: `Bearer ${this.config.token.jti}` }
            }

            $.ajax(req)
        })
    }

    get(username, repo_name, login_name) {
        return new Promise((resolve, reject) => {
            const public_only = username !== login_name
            const full_name = [username, repo_name].join("/")
            const repo = data.repos.get(full_name)

            if (repo && (public_only ? repo.is_public : true)) {
                resolve(copyRepo(repo, full_name))
            } else {
                reject(Error("Repository does not exist"))
            }
        })
    }

    getRepo(repo_owner, repo_name, branch_name) {
        return new Promise((resolve, reject) => {
            let req = {
                url: `${this.config.repo_url}/users/${repo_owner}/repos/${repo_name}`,
                type: "GET",
                dataType: "json",
                success: (json) => resolve(json),
                error: (error) => reject({ code: error.status,
                    status: error.statusText,
                    message: error.responseText })
            }

            if (this.config.token) {
                req["headers"] = { Authorization: `Bearer ${this.config.token.jti}` }
            }

            $.ajax(req)
        })
    }

    getBranch(repo_owner, repo_name, branch_name) {
        return new Promise((resolve, reject) => {
            let req = {
                url: `${this.config.repo_url}/users/${repo_owner}/repos/${repo_name}/branches/${branch_name}`,
                type: "GET",
                dataType: "json",
                success: (json) => resolve(json),
                error: (error) => reject({ code: error.status,
                                            status: error.statusText,
                                            message: error.responseText })
            }

            if (this.config.token) {
                req["headers"] = { Authorization: `Bearer ${this.config.token.jti}` }
            }

            $.ajax(req)
        })
    }

    getDirectorySection(repo_owner, repo_name, branch_name, path) {
        return new Promise((resolve, reject) => {
            let req = {
                url: `${this.config.repo_url}/users/${repo_owner}/repos/${repo_name}/browse/${branch_name}/${path}`,
                type: "GET",
                dataType: "json",
                success: (json) => resolve(json),
                error: (error) => reject({ code: error.status,
                                            status: error.statusText,
                                            message: error.responseText })
            }

            if (this.config.token) {
                req["headers"] = { Authorization: `Bearer ${this.config.token.jti}` }
            }

            $.ajax(req)
        })
    }

    getTextFileContent(repo_owner, repo_name, object_id) {
        return new Promise((resolve, reject) => {
            let req = {
                url: `${this.config.repo_url}/users/${repo_owner}/repos/${repo_name}/objects/${object_id}`,
                type: "GET",
                dataType: "text",
                success: (text) => resolve(text),
                error: (error) => reject({ code: error.status,
                                            status: error.statusText,
                                            message: error.responseText })
            }

            if (this.config.token) {
                req["headers"] = { Authorization: `Bearer ${this.config.token.jti}` }
            }

            $.ajax(req)
        })
    }

    create(account_login, repo_form) {
        return new Promise((resolve, reject) => {
            let name = repo_form.name || ""
            if (!name.match(/^[a-zA-Z0-9_\-]*$/)) {
                reject(Error("Repository name must only contain alphanumeric characters"))
                return
            }

            if (name.length < 2 || name.length > 20) {
                reject(Error("Repository name must be between 2 and 20 characters long"))
                return
            }

            $.ajax({
                url: `${this.config.repo_url}/users/${account_login}/repos`,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                headers: {Authorization: `Bearer ${this.config.token.jti}`},
                data: JSON.stringify(repo_form),
                dataType: "json",
                success: (repo) => resolve(repo),
                error: (error) => reject(error.statusText ? Error(error.statusText) : Error("An internal error occurred"))
            })
        })
    }


    update(repository) {
        const full_name = [repository.owner, repository.name].join("/")

        return new Promise((resolve, reject) => {
            const repo = data.repos.get(full_name)

            if (repo) {
                repo.description = repository.description
                repo.shared = repository.shared
                repo.is_public = repository.is_public

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

            if (repo && (public_only ? repo.is_public : true)) {
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

            if (repo && (public_only ? repo.is_public : true)) {
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
