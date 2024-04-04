<script setup>
	import { ScheduleXCalendar } from "@schedule-x/vue";
	import {
		createCalendar,
		viewDay,
		viewWeek,
		viewMonthGrid,
		viewMonthAgenda,
	} from "@schedule-x/calendar";
	import "@schedule-x/theme-default/dist/index.css";
	import { createResizePlugin } from "@schedule-x/resize";
	import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
	import { createEventModalPlugin } from "@schedule-x/event-modal";
	import { onMounted } from "vue";
	import { initFlowbite } from "flowbite";
	import { PlusIcon, ArrowPathIcon } from "@heroicons/vue/24/solid";

	const modalIsOpen = useState("add-event-modal", () => false);

	const { getAllBookings } = useRealmApp();

	const calendarApp = createCalendar({
		selectedDate: getEventDate(Date.now()),
		views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
		defaultView: viewWeek.name,
		plugins: [
			createResizePlugin(),
			createDragAndDropPlugin(),
			createEventModalPlugin(),
		],
		dayBoundaries: {
			start: "00:00",
			end: "23:59",
		},
		events: [],
		calendars: {
			work: {
				colorName: "work",
				lightColors: {
					container: "#fff",
					onContainer: "#000",
					main: "#fff",
				},
				darkColors: {
					container: "#000",
					onContainer: "#fff",
					main: "#000",
				},
			},
		},
	});

	const isFetching = ref(false);

	onMounted(() => {
		initFlowbite();

		getAllBookings()
			.then((events) => {
				calendarApp.events.set(events);
			})
			.catch((err) => console.log(err));
	});

	const onAddEvent = (data) => {
		calendarApp.events.add(data);
	};

	const fetchLatestEvents = async () => {
		isFetching.value = true;
		try {
			const events = await getAllBookings();
			calendarApp.events.set(events);
			isFetching.value = false;
		} catch (err) {
			isFetching.value = false;
		}
	};
</script>

<template>
	<div class="h-full overflow-hidden mt-4">
		<div class="flex items-center gap-3 mb-3">
			<button
				title="Fetch latest events"
				@click="fetchLatestEvents"
				:disabled="isFetching"
				:class="{ 'pointer-events-none': isFetching }"
				class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-5 rounded">
				<ArrowPathIcon
					:class="{ 'animate-spin': isFetching }"
					class="w-5 h-5" />
			</button>
			<button
				@click="modalIsOpen = true"
				class="w-full bg-gray-200 flex items-center gap-1 justify-center text-gray-900 border border-gray-300 focus:outline-none hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg py-3 text-center cursor-pointer"
				type="button">
				<PlusIcon class="w-5 h-5" />
				<span> Add Event </span>
			</button>
		</div>
		<ClientOnly>
			<ScheduleXCalendar :calendar-app="calendarApp" />
		</ClientOnly>

		<AddEvent @add-event="onAddEvent" />
	</div>
</template>

<style>
	.sx-vue-calendar-wrapper {
		width: 100%;
		height: 100vh;
		max-height: 90vh;
	}
</style>
