import moment from "moment";

// will convert like this (01:00 PM -> 13:00)
const convertToRailwayTime = (AMPMTime) => {
	const railwayTime = moment(AMPMTime, ["h:mm A"]).format("HH:mm");

	return railwayTime;
};

export default convertToRailwayTime;
