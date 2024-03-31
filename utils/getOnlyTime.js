import moment from "moment";

const getOnlyTime = (dateTimeStr) => {
	var momentObj = moment(dateTimeStr);

	var timePart = momentObj.format("HH:mm");

	return timePart;
};

export default getOnlyTime;
