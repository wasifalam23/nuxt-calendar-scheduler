import moment from "moment";

// will convert like this ("2024-04-04 13:00" -> "01:00 PM")
const convertToAMPMTime = (railDateTime) => {
	const momentTime = moment(railDateTime);
	return momentTime.format("hh:mm A");
};

export default convertToAMPMTime;
