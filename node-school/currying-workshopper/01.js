// add some numbers: accumulate(1)(2)(3)(4)(5)()

function accumulate(a) {
	var values = []
	if (a !== undefined) {
		values.push(a)
		var lt = function(ac) {
			if (ac !== undefined) {
				values.push(ac)
				return lt
			} else {
				return values.reduce((a, b) => a+b, 0)
			}
		}
		return lt
	} 
}

module.exports = accumulate
