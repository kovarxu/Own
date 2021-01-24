var STATE_PENDING = 'STATE_PENDING';
var STATE_FULLFILLED = 'STATE_FULLFILLED';
var STATE_REJECTED = 'STATE_REJECTED';

function Prom (fn) {
    this.resolveHandlers = [];
    this.rejectHandlers = [];
    this.state = STATE_PENDING;
    this.result = undefined;
    this.reason = undefined;

    const resolve = (result) => {
        setTimeout(() => {
            if (this.state === STATE_PENDING) {
                this.state = STATE_FULLFILLED;
                this.result = result;
                this.resolveHandlers.forEach(handler => handler(result));
            }
        }, 0)
    }
    const reject = (reason) => {
        setTimeout(() => {
            if (this.state === STATE_PENDING) {
                this.state = STATE_REJECTED;
                this.reason = reason;
                this.rejectHandlers.forEach(handler => handler(reason));
            }
        }, 0)
    }

    fn(resolve, reject);
}

Prom.prototype.then = function(res, rej) {
    if (!res) res = data => data;
    if (!rej) rej = err => {
        throw err;
    };

    return new Prom((resolve, reject) => {
        this.resolveHandlers.push(() => {
            try {
                const data = res(this.result);
                resolve(data);
            } catch(err) {
                reject(err);
            }
        });

        this.rejectHandlers.push(() => {
            try {
                const data = rej(this.reason);
                resolve(data);
            } catch(err) {
                reject(err);
            }
        })
    })
}

// var p = new Prom((resolve, reject) => {
//     resolve(3);
// }).then((data) => console.log(data))
