function mapOf(obj) {
    const map = new Map()
    for (let k in obj) {
        if (obj.hasOwnProperty(k)) {
            map.set(k, obj[k])
        }
    }
    return map
}

var data = {
    accounts: mapOf({
        "stoewer": {
            username: "stoewer",
            password: "testtest",
            email: "as@example.com",
            title: "Dr.",
            firstName: "Adrian",
            lastName: "Stoewer"
        },
        "alice": {
            username: "alice",
            password: "testtest",
            email: null,
            title: null,
            firstName: "Alice",
            lastName: "Goodchild"
        }
    }),
    repos: [
        
    ]
}

export class AccountAPI {

    login(username, password) {
        return new Promise((resolve, reject) => {
            let acc = data.accounts.get(username)
            if (acc && acc.password === password) {
                resolve(acc)
            } else {
                reject(Error("Invalid user name or password"))
            }
        })
    }

    get(username) {
        return new Promise((resolve, reject) => {
            let acc = data.accounts.get(username)
            if (acc) {
                resolve(acc)
            } else {
                reject(Error("Account does not exist"))
            }
        })
    }

    update(account) {
        return this.get(account.username).then(
            () => {
                data.accounts.set(account.username, account)
                return account
            }
        )
    }
    
    updatePassword(username, oldPassword, newPassword, repeatedPassword) {
        return this.get(username).then(
            (acc) => {
                if (acc.password !== oldPassword) {
                    return Promise.reject(Error("Old password does not match"))
                } else if (newPassword !== repeatedPassword) {
                    return Promise.reject(Error("Repeated password does not match"))
                } else {
                    acc.password = newPassword
                    return acc
                }
            }
        )
    }
}