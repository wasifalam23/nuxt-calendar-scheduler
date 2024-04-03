import moment from "moment";

// will convert like this (13:00 -> 01:00 PM)
const convertToAMPMTime = (railTime) => {
	const momentTime = moment(railTime, "HH:mm");
	return momentTime.format("hh:mm A");
};

export default convertToAMPMTime;
