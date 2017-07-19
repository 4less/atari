function generateRandomArray(lower, upper, length) {
	result = [];

	for (var i = 0; i < length; i++)
		result.push(Math.random()*(upper-lower)+lower);
	return result;
}
